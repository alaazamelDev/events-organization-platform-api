import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { FillFormDto } from '../dto/fill-form.dto';
import { EntityManager } from 'typeorm';
import { FormField } from '../entities/ form-field.entity';
import { FillFormFieldDto } from '../dto/fill-form-field.dto';
import { FIELD_TYPE } from '../dto/create-form-field.dto';

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
      ![FIELD_TYPE.RADIO_BUTTON].includes(+field_type.fieldTypeId) ||
      ([FIELD_TYPE.RADIO_BUTTON].includes(+field_type.fieldTypeId) &&
        _value !== undefined)
    );
  }

  defaultMessage(_args: ValidationArguments) {
    const object = _args.object as FillFormFieldDto;
    return `${_args.property} provide option_id for the field with id: ${object.field_id}`;
  }
}
