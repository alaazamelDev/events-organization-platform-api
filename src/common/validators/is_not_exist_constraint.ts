import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { IsNotExistInterface } from '../decorators/is_not_exist.decorator';

@ValidatorConstraint({ name: 'IsNotExistConstraint', async: true })
@Injectable()
export class IsNotExistConstraint implements ValidatorConstraintInterface {
  constructor(private readonly entityManager: EntityManager) {}

  async validate(value: any, args?: ValidationArguments): Promise<boolean> {
    const { tableName, column }: IsNotExistInterface = args?.constraints[0];

    return !(await this.entityManager
      .getRepository(tableName)
      .createQueryBuilder(tableName)
      .where({ [column]: value })
      .getExists());
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    const field: string | undefined = validationArguments?.property;
    return `${field} is already exist`;
  }
}
