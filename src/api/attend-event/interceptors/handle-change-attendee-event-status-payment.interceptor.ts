import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ChangeAttendEventStatusDto } from '../dto/change-attend-event-status.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from '../../event/entities/event.entity';
import { DataSource, Repository } from 'typeorm';
import { AttendeeEventStatus } from '../enums/attendee-event-status.enum';
import { TicketsEventTypes } from '../../payment/constants/tickets-event-types.constant';
import { AttendeesTickets } from '../../payment/entities/attendees-tickets.entity';
import { OrganizationsTickets } from '../../payment/entities/organizations-tickets.entity';

@Injectable()
export class HandleChangeAttendeeEventStatusPaymentInterceptor
  implements NestInterceptor
{
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    private readonly dataSource: DataSource,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const httpContext = context.switchToHttp();
    const req = httpContext.getRequest();
    const body = req.body as ChangeAttendEventStatusDto;
    const queryRunner = req.queryRunner;

    const event = await this.eventRepository.findOneOrFail({
      where: {
        id: body.event_id,
      },
      relations: {
        organization: true,
      },
    });

    if (body.status === AttendeeEventStatus.rejected && event.fees) {
      const attendeeTickets = await this.dataSource
        .getRepository(AttendeesTickets)
        .createQueryBuilder('tickets')
        .where('tickets.attendee = :attendeeID', {
          attendeeID: body.attendee_id,
        })
        .andWhere('tickets.event = :eventID', {
          eventID: TicketsEventTypes.CONSUME,
        })
        .andWhere(
          `tickets.data ::jsonb @> \'{"event_id":"${body.event_id}"} \'`,
        )
        .getOneOrFail();

      const organizationTickets = await this.dataSource
        .getRepository(OrganizationsTickets)
        .createQueryBuilder('tickets')
        .where('tickets.organization = :organizationID', {
          organizationID: event.organization.id,
        })
        .andWhere(
          `tickets.data ::jsonb @> \'{"event_id":"${body.event_id}", "attendee_id":"${body.attendee_id}"}\'`,
        )
        .getOneOrFail();

      await queryRunner.manager
        .createQueryBuilder()
        .delete()
        .from(AttendeesTickets)
        .where('id = :id', { id: attendeeTickets.id })
        .execute();

      await queryRunner.manager
        .createQueryBuilder()
        .delete()
        .from(OrganizationsTickets)
        .where('id = :id', { id: organizationTickets.id })
        .execute();
    }

    return next.handle();
  }
}
