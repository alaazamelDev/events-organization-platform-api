import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { DataSource } from 'typeorm';
import { Event } from '../entities/event.entity';

@Injectable()
export class CheckEventIfStartedBeforeDeleteInterceptor
  implements NestInterceptor
{
  constructor(private readonly dataSource: DataSource) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const event_id = request.params.id;

    const event_start_date = await this.dataSource
      .getRepository(Event)
      .createQueryBuilder('event')
      .select('MIN(day.dayDate)', 'start_date')
      .where('event.id = :eventID', { eventID: event_id })
      .leftJoin('event.days', 'day')
      .groupBy('event.id')
      .getRawOne();

    const currentDate = new Date().getTime();
    const eventDate = new Date(event_start_date.start_date).getTime();

    if (!event_start_date || eventDate <= currentDate) {
      throw new BadRequestException(
        'The Event already started and can not be deleted',
      );
    }

    return next.handle();
  }
}
