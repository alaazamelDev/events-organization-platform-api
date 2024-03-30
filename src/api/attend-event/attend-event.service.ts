import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Event } from '../event/entities/event.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AttendeeEvent } from './entities/attendee-event.entity';
import { AttendEventDto } from './dto/attend-event.dto';
import { Attendee } from '../attendee/entities/attendee.entity';
import { User } from '../user/entities/user.entity';
import { AttendeeEventStatus } from './enums/attendee-event-status.enum';

@Injectable()
export class AttendEventService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(AttendeeEvent)
    private readonly attendeeEventRepository: Repository<AttendeeEvent>,
    @InjectRepository(Attendee)
    private readonly attendeeRepository: Repository<Attendee>,
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

    const attendEvent = this.attendeeEventRepository.create({
      event: event,
      attendee: attendee,
      status: event.directRegister
        ? AttendeeEventStatus.accepted
        : AttendeeEventStatus.waiting,
    });

    await this.attendeeEventRepository.save(attendEvent, { reload: true });

    return attendEvent.status;
  }
}
