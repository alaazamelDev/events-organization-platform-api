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
import { Attendee } from '../../attendee/entities/attendee.entity';
import { PaymentAttendeeService } from '../../payment/services/payment-attendee.service';
import { AttendEventDto } from '../dto/attend-event.dto';
import { ChangeAttendEventStatusDto } from '../dto/change-attend-event-status.dto';
import { AttendeeEventStatus } from '../enums/attendee-event-status.enum';

@Injectable()
export class CheckAttendeeBalanceAgainstEventFeesInterceptor
  implements NestInterceptor
{
  constructor(
    private readonly dataSource: DataSource,
    private readonly paymentAttendeeService: PaymentAttendeeService,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const body = request.body as AttendEventDto & ChangeAttendEventStatusDto;
    const eventID = request.body.event_id;

    await this.dataSource
      .getRepository(Event)
      .createQueryBuilder('event')
      .where('event.id = :eventID', { eventID: eventID })
      .getOneOrFail()
      .then(async (event) => {
        if (
          (event.directRegister && event.fees) ||
          (event.fees && body.status === AttendeeEventStatus.accepted)
        ) {
          const getAttendeeQuery = this.dataSource
            .getRepository(Attendee)
            .createQueryBuilder('attendee');

          if (body.attendee_id) {
            getAttendeeQuery.where('attendee.id = :attendeeID', {
              attendeeID: body.attendee_id,
            });
          } else {
            const userID = request.user.sub;
            getAttendeeQuery.where('attendee.user = :userID', {
              userID: userID,
            });
          }
          const attendee = await getAttendeeQuery.getOneOrFail();

          const balance = await this.paymentAttendeeService
            .getAttendeeTicketsBalance(attendee.id)
            .then((obj) => obj.balance);

          if (Number(event.fees) > Number(balance)) {
            throw new BadRequestException(
              'Attendee tickets balance does not cover the event fees',
            );
          }
        }
      });

    return next.handle();
  }
}
