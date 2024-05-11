import { InjectRepository } from '@nestjs/typeorm';
import { ChangeAttendEventStatusDto } from '../dto/change-attend-event-status.dto';
import { AttendeeEvent } from '../entities/attendee-event.entity';
import { QueryRunner, Repository } from 'typeorm';
import { Event } from '../../event/entities/event.entity';
import { Attendee } from '../../attendee/entities/attendee.entity';

export class ManageAttendEventService {
  constructor(
    @InjectRepository(AttendeeEvent)
    private readonly attendeeEventRepository: Repository<AttendeeEvent>,
  ) {}

  async changeAttendEventStatus(
    manageAttendEventDto: ChangeAttendEventStatusDto,
    queryRunner: QueryRunner,
  ) {
    const attendEvent = await this.attendeeEventRepository.findOneOrFail({
      where: {
        event: { id: manageAttendEventDto.event_id } as Event,
        attendee: { id: manageAttendEventDto.attendee_id } as Attendee,
      },
      relations: { event: true, attendee: true },
    });

    attendEvent.status = manageAttendEventDto.status;

    await queryRunner.manager.save(attendEvent);

    return attendEvent.status;
  }
}
