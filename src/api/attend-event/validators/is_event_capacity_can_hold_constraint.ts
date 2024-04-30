import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Event } from '../../event/entities/event.entity';
import { AttendeeEvent } from '../entities/attendee-event.entity';
import { AttendeeEventStatus } from '../enums/attendee-event-status.enum';
import { AttendEventDto } from '../dto/attend-event.dto';
import { ChangeAttendEventStatusDto } from '../dto/change-attend-event-status.dto';

@ValidatorConstraint({ name: 'IsEventCapacityCanHoldConstraint', async: true })
@Injectable()
export class IsEventCapacityCanHoldConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly entityManager: EntityManager) {}

  async validate(value: any, _args?: ValidationArguments): Promise<boolean> {
    const object = _args?.object as AttendEventDto & ChangeAttendEventStatusDto;

    const event = await this.entityManager
      .getRepository(Event)
      .createQueryBuilder()
      .where('id = :eventID', { eventID: value })
      .getOneOrFail();

    const registeredNum = await this.entityManager
      .getRepository(AttendeeEvent)
      .createQueryBuilder('attendeeEvent')
      .select([])
      .where('attendeeEvent.event = :eventID', { eventID: value })
      .andWhere('attendeeEvent.status = :status', {
        status: AttendeeEventStatus.accepted,
      })
      .groupBy('attendeeEvent.event')
      .addSelect('COUNT(*)', 'attendees')
      .getRawOne()
      .then((obj) => Number(obj.attendees));

    return (!event.directRegister && !object.status) ||
      (object.status && object.status !== AttendeeEventStatus.accepted)
      ? true
      : registeredNum < event.capacity;
  }

  defaultMessage(_validationArguments?: ValidationArguments): string {
    return `the event capacity is full`;
  }
}
