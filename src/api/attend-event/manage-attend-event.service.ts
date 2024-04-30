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

      await queryRunner.manager.save(attendEvent);

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
      }

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
