import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Event } from '../event/entities/event.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AttendeeEvent } from './entities/attendee-event.entity';
import { AttendEventDto } from './dto/attend-event.dto';
import { Attendee } from '../attendee/entities/attendee.entity';
import { User } from '../user/entities/user.entity';
import { AttendeeEventStatus } from './enums/attendee-event-status.enum';
import { AttendeesTickets } from '../payment/entities/attendees.tickets';
import { TicketsEventTypes } from '../payment/constants/tickets-event-types.constant';
import { TicketEventType } from '../payment/entities/ticket-event-type.entity';

@Injectable()
export class AttendEventService {
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

  async attendEvent(
    attendEventDto: AttendEventDto,
    userID: number | undefined,
  ) {
    const attendee = await this.attendeeRepository.findOneOrFail({
      where: { user: { id: userID } as User },
    });

    const event = await this.eventRepository.findOneOrFail({
      where: {
        id: attendEventDto.event_id,
      },
    });
    const queryRunner = this.dataSource.createQueryRunner();

    try {
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

      const attendEvent = this.attendeeEventRepository.create({
        event: event,
        attendee: attendee,
        status: event.directRegister
          ? AttendeeEventStatus.accepted
          : AttendeeEventStatus.waiting,
      });

      await queryRunner.manager.save(attendEvent, { reload: true });

      await queryRunner.commitTransaction();

      return attendEvent.status;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }
}
