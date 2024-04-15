import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { EntityManager } from 'typeorm';
import { FormField } from '../entities/form-field.entity';
import { fieldTypesWithOptions } from '../constants/constants';
import { AddOptionDto } from '../dto/update-form/add-option.dto';

@ValidatorConstraint({
  name: 'IsFieldTypeSupportOptionsConstraint',
  async: true,
})
export class IsFieldTypeSupportOptionsConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly entityManager: EntityManager) {}

  async validate(_value: any, _args: ValidationArguments) {
    const object = _args.object as AddOptionDto;

    const { fieldTypeId } = await this.entityManager
      .getRepository(FormField)
      .createQueryBuilder('field')
      .where('field.id = :id', { id: +object.field_id })
      .getOneOrFail();

    return fieldTypesWithOptions.includes(+fieldTypeId);
  }

  defaultMessage(_args: ValidationArguments) {
    return `field does not support adding options`;
  }
}
