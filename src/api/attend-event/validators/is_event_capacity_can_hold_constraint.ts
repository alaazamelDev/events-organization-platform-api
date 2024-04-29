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

@ValidatorConstraint({ name: 'IsEventCapacityCanHoldConstraint', async: true })
@Injectable()
export class IsEventCapacityCanHoldConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly entityManager: EntityManager) {}

  async validate(value: any, _args?: ValidationArguments): Promise<boolean> {
    const event = await this.entityManager
      .getRepository(Event)
      .createQueryBuilder()
      .where('id = :eventID', { eventID: value })
      .getOneOrFail();

    const registered = await this.entityManager
      .getRepository(AttendeeEvent)
      .createQueryBuilder('attendeeEvent')
      .select([])
      .where('attendeeEvent.event = :eventID', { eventID: value })
      .andWhere('attendeeEvent.status = :status', {
        status: AttendeeEventStatus.accepted,
      })
      .groupBy('attendeeEvent.event')
      .addSelect('COUNT(*)', 'attendees')
      .getRawOne();

    // TODO continue implementing, if not direct register return true else check capacity
    console.log(registered);

    return !event.directRegister ? true : true;
  }

  defaultMessage(_validationArguments?: ValidationArguments): string {
    return `the event capacity is full`;
  }
}
