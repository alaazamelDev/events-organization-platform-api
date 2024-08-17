import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { ChangeAttendEventStatusDto } from '../dto/change-attend-event-status.dto';
import { Event } from '../../event/entities/event.entity';
import { AttendeeEventStatus } from '../enums/attendee-event-status.enum';

@ValidatorConstraint({
  name: 'IsNewStatusSuitsTheEventConstraint',
  async: true,
})
@Injectable()
export class IsNewStatusSuitsTheEventConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly entityManager: EntityManager) {}

  async validate(_value: any, _args?: ValidationArguments): Promise<boolean> {
    const object = _args?.object as ChangeAttendEventStatusDto;

    const event = await this.entityManager
      .getRepository(Event)
      .createQueryBuilder('event')
      .where('event.id = :eventID', {
        eventID: object.event_id,
      })
      .getOneOrFail();

    return !(
      event.directRegister && object.status === AttendeeEventStatus.waiting
    );
  }

  defaultMessage(_validationArguments?: ValidationArguments): string {
    return `can not set to waiting in direct register events`;
  }
}
