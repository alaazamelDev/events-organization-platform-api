import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { EntityManager } from 'typeorm';
import { FormField } from '../entities/form-field.entity';
import { FillFormFieldDto } from '../dto/fill-form/fill-form-field.dto';
import { fieldTypesWithOptions } from '../constants/constants';

@ValidatorConstraint({ name: 'fieldOptionRequired', async: true })
export class IsFieldOptionRequiredConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly entityManager: EntityManager) {}

  async validate(_value: any, _args: ValidationArguments) {
    const object = _args.object as FillFormFieldDto;
    const field_id = object.field_id;

    const field_type = await this.entityManager
      .getRepository(FormField)
      .createQueryBuilder('field')
      .where('field.id = :id', { id: field_id })
      .getOneOrFail();

    return (
      !fieldTypesWithOptions.includes(+field_type.fieldTypeId) ||
      (fieldTypesWithOptions.includes(+field_type.fieldTypeId) &&
        _value !== undefined)
    );
  }

  defaultMessage(_args: ValidationArguments) {
    const object = _args.object as FillFormFieldDto;
    return `${_args.property} provide option_id for the field with id: ${object.field_id}`;
  }
}
