import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { AttendeeEvent } from '../entities/attendee-event.entity';
import { ChangeAttendEventStatusDto } from '../dto/change-attend-event-status.dto';

@ValidatorConstraint({
  name: 'IsAttendeeEventStatusSameConstraint',
  async: true,
})
@Injectable()
export class IsAttendeeEventStatusSameConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly entityManager: EntityManager) {}

  async validate(_value: any, _args?: ValidationArguments): Promise<boolean> {
    const object = _args?.object as ChangeAttendEventStatusDto;

    const attendeeStatus = await this.entityManager
      .getRepository(AttendeeEvent)
      .createQueryBuilder('attendeeEvent')
      .where('attendeeEvent.attendee = :attendeeID', {
        attendeeID: object.attendee_id,
      })
      .andWhere('attendeeEvent.event = :eventID', { eventID: object.event_id })
      .getOneOrFail()
      .then((obj) => obj.status);

    return !(attendeeStatus === object.status);
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    const object = validationArguments?.object as ChangeAttendEventStatusDto;
    return `the attendee with id ${object.attendee_id} is already ${object.status} in event ${object.event_id}`;
  }
}
