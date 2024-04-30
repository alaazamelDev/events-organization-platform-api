import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { DataSource } from 'typeorm';
import { Event } from '../../event/entities/event.entity';
import { FilledForm } from '../../dynamic-forms/entities/filled-form.entity';
import { Attendee } from '../../attendee/entities/attendee.entity';

@Injectable()
export class CheckEventFormIfSubmittedInterceptor implements NestInterceptor {
  constructor(private readonly dataSource: DataSource) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const userID = request.user.sub;
    const eventID = request.body.event_id;

    await this.dataSource
      .getRepository(Event)
      .createQueryBuilder('event')
      .where('event.id = :eventID', { eventID: eventID })
      .leftJoinAndSelect('event.form', 'form')
      .getOneOrFail()
      .then(async (event) => {
        if (event.form) {
          const attendee = await this.dataSource
            .getRepository(Attendee)
            .createQueryBuilder('attendee')
            .where('attendee.user = :userID', { userID: userID })
            .getOneOrFail();

          const filledForm = await this.dataSource
            .getRepository(FilledForm)
            .createQueryBuilder('filledForm')
            .where('filledForm.form = :formID', { formID: event.form.id })
            .andWhere('filledForm.attendee = :attendeeID', {
              attendeeID: attendee.id,
            })
            .andWhere('filledForm.event = :eventID', { eventID: event.id })
            .getOne();

          if (!filledForm) {
            throw new BadRequestException(
              'The Attendee must fill the event form before registration',
            );
          }
        }
      });

    return next.handle();
  }
}
