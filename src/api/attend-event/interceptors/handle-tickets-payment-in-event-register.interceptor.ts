import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { AttendeesTickets } from '../../payment/entities/attendees.tickets';
import { DataSource, Repository } from 'typeorm';
import { Event } from '../../event/entities/event.entity';
import { AttendeeEvent } from '../entities/attendee-event.entity';
import { Attendee } from '../../attendee/entities/attendee.entity';
import { User } from '../../user/entities/user.entity';
import { AttendEventDto } from '../dto/attend-event.dto';
import { catchError, tap } from 'rxjs/operators';
import { TicketsEventTypes } from '../../payment/constants/tickets-event-types.constant';
import { TicketEventType } from '../../payment/entities/ticket-event-type.entity';

@Injectable()
export class HandleTicketsPaymentInEventRegisterInterceptor
  implements NestInterceptor
{
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(AttendeeEvent)
    private readonly attendeeEventRepository: Repository<AttendeeEvent>,
    @InjectRepository(Attendee)
    private readonly attendeeRepository: Repository<Attendee>,
    @InjectRepository(AttendeesTickets)
    private readonly attendeesTickets: Repository<AttendeesTickets>,
    private readonly dataSource: DataSource,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const userID = request.user.sub;
    const body = request.body as AttendEventDto;

    const attendee = await this.attendeeRepository.findOneOrFail({
      where: { user: { id: userID } as User },
    });

    const event = await this.eventRepository.findOneOrFail({
      where: {
        id: body.event_id,
      },
    });

    const queryRunner = this.dataSource.createQueryRunner();
    request.queryRunner = queryRunner;

    await queryRunner.connect();
    await queryRunner.startTransaction();

    if (event.fees && event.directRegister) {
      const ticketsEvent = this.attendeesTickets.create({
        event: { id: TicketsEventTypes.REGISTER_IN_EVENT } as TicketEventType,
        data: { event_id: event.id },
        attendee: attendee,
        value: -1 * event.fees,
      });

      await queryRunner.manager.save(ticketsEvent);
    }

    return next.handle().pipe(
      tap(async () => {
        await queryRunner.commitTransaction();
        await queryRunner.release();
      }),
      catchError(async (err) => {
        await queryRunner.rollbackTransaction();
        await queryRunner.release();

        return throwError(err);
      }),
    );
  }
}
