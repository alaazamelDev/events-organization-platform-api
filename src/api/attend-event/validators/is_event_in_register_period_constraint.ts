import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Event } from '../../event/entities/event.entity';

@ValidatorConstraint({ name: 'IsEventInRegisterPeriodConstraint', async: true })
@Injectable()
export class IsEventInRegisterPeriodConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly entityManager: EntityManager) {}

  async validate(value: any, _args?: ValidationArguments): Promise<boolean> {
    const event = await this.entityManager
      .getRepository(Event)
      .createQueryBuilder()
      .where('id = :eventID', { eventID: value })
      .getOneOrFail();

    const current_date = Date.now();
    const start_date = event.registrationStartDate.getTime();
    const end_date = event.registrationEndDate
      ? event.registrationEndDate.getTime()
      : current_date + 100;

    return current_date >= start_date && current_date <= end_date;
  }

  defaultMessage(_validationArguments?: ValidationArguments): string {
    return `the event is not in the registration period`;
  }
}
