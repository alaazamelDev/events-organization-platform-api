import { InjectRepository } from '@nestjs/typeorm';
import { ChangeAttendEventStatusDto } from './dto/change-attend-event-status.dto';
import { AttendeeEvent } from './entities/attendee-event.entity';
import { DataSource, Repository } from 'typeorm';
import { Event } from '../event/entities/event.entity';
import { Attendee } from '../attendee/entities/attendee.entity';
import { AttendeeEventStatus } from './enums/attendee-event-status.enum';
import { TicketsEventTypes } from '../payment/constants/tickets-event-types.constant';
import { TicketEventType } from '../payment/entities/ticket-event-type.entity';
import { AttendeesTickets } from '../payment/entities/attendees.tickets';

export class ManageAttendEventService {
  constructor(
    @InjectRepository(AttendeeEvent)
    private readonly attendeeEventRepository: Repository<AttendeeEvent>,
    @InjectRepository(AttendeesTickets)
    private readonly attendeesTickets: Repository<AttendeesTickets>,
    private readonly dataSource: DataSource,
  ) {}

  async changeAttendEventStatus(
    manageAttendEventDto: ChangeAttendEventStatusDto,
  ) {
    const attendEvent = await this.attendeeEventRepository.findOneOrFail({
      where: {
        event: { id: manageAttendEventDto.event_id } as Event,
        attendee: { id: manageAttendEventDto.attendee_id } as Attendee,
      },
      relations: { event: true, attendee: true },
    });

    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      attendEvent.status = manageAttendEventDto.status;

      if (
        manageAttendEventDto.status === AttendeeEventStatus.accepted &&
        attendEvent.event.fees
      ) {
        const ticketsEvent = this.attendeesTickets.create({
          event: { id: TicketsEventTypes.REGISTER_IN_EVENT } as TicketEventType,
          data: { event_id: attendEvent.event.id },
          attendee: attendEvent.attendee,
          value: -1 * attendEvent.event.fees,
        });

        await queryRunner.manager.save(ticketsEvent);
      } else if (
        manageAttendEventDto.status === AttendeeEventStatus.rejected &&
        attendEvent.event.fees
      ) {
        const toDelete = await this.dataSource
          .getRepository(AttendeesTickets)
          .createQueryBuilder('tickets')
          .where('tickets.attendee = :attendeeID', {
            attendeeID: manageAttendEventDto.attendee_id,
          })
          .andWhere('tickets.event = :eventID', {
            eventID: TicketsEventTypes.REGISTER_IN_EVENT,
          })
          .andWhere(
            `tickets.data ::jsonb @> \'{"event_id":"${manageAttendEventDto.event_id}"} \'`,
          )
          .getOneOrFail();

        await queryRunner.manager
          .createQueryBuilder()
          .delete()
          .from(AttendeesTickets)
          .where('id = :id', { id: toDelete.id })
          .execute();
      }

      await queryRunner.manager.save(attendEvent);
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
