import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { QueryRunner, Repository } from 'typeorm';
import { TicketsEventTypes } from '../../payment/constants/tickets-event-types.constant';
import { TicketEventType } from '../../payment/entities/ticket-event-type.entity';
import { User } from '../../user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from '../../event/entities/event.entity';
import { Attendee } from '../../attendee/entities/attendee.entity';
import { AttendeesTickets } from '../../payment/entities/attendees-tickets.entity';
import { AttendEventDto } from '../dto/attend-event.dto';
import { OrganizationsTickets } from '../../payment/entities/organizations-tickets.entity';

@Injectable()
export class HandleRegisterInEventsPaymentInterceptor
  implements NestInterceptor
{
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(Attendee)
    private readonly attendeeRepository: Repository<Attendee>,
    @InjectRepository(AttendeesTickets)
    private readonly attendeesTickets: Repository<AttendeesTickets>,
    @InjectRepository(OrganizationsTickets)
    private readonly organizationsTickets: Repository<OrganizationsTickets>,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const httpContext = context.switchToHttp();
    const req = httpContext.getRequest();

    const queryRunner: QueryRunner = req.queryRunner;

    const body: AttendEventDto = req.body;
    const userID = req.user.sub;

    const attendee = await this.attendeeRepository.findOneOrFail({
      where: { user: { id: userID } as User },
    });

    const event = await this.eventRepository.findOneOrFail({
      where: {
        id: body.event_id,
      },
      relations: {
        organization: true,
      },
    });

    if (event.fees && event.fees > 0) {
      const ticketsEvent = this.attendeesTickets.create({
        event: { id: TicketsEventTypes.CONSUME } as TicketEventType,
        data: { event_id: event.id },
        attendee: attendee,
        value: -1 * event.fees,
      });

      const organizationTickets = this.organizationsTickets.create({
        organization: event.organization,
        value: event.fees,
        data: { event_id: event.id, attendee_id: attendee.id },
      });

      await queryRunner.manager.save(organizationTickets);
      await queryRunner.manager.save(ticketsEvent);
    }

    return next.handle();
  }
}
