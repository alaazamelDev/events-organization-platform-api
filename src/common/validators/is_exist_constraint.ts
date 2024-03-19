import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { IsExistInterface } from '../decorators/is_exist.decorator';

@ValidatorConstraint({ name: 'IsExistConstraint', async: true })
@Injectable()
export class IsExistConstraint implements ValidatorConstraintInterface {
  constructor(private readonly entityManager: EntityManager) {}

  async validate(value: any, args?: ValidationArguments): Promise<boolean> {
    const { tableName, column }: IsExistInterface = args?.constraints[0];

    const valueExist = await this.entityManager
      .getRepository(tableName)
      .createQueryBuilder(tableName)
      .where({ [column]: value })
      .getExists();

    return valueExist;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    const field: string | undefined = validationArguments?.property;
    return `${field} doesn't exist`;
  }
}
