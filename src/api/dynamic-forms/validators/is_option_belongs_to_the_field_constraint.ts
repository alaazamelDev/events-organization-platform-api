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
import { FieldOption } from '../entities/field-option.entity';

@ValidatorConstraint({ name: 'optionBelongsToTheField', async: true })
export class IsOptionBelongsToTheFieldConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly entityManager: EntityManager) {}

  async validate(_value: any, _args: ValidationArguments) {
    const object = _args.object as FillFormFieldDto;
    const option_id = object.option_id;
    const field_id = object.field_id;

    if (_value === undefined) {
      return true;
    }

    const option = await this.entityManager
      .getRepository(FieldOption)
      .createQueryBuilder('option')
      .where('option.id = :id', { id: option_id })
      .getOneOrFail();

    return Number(option.formFieldId) === field_id;
  }

  defaultMessage(_args: ValidationArguments) {
    const object = _args.object as FillFormFieldDto;
    return `${_args.property} provided option_id does not belong to the field with id: ${object.field_id}`;
  }
}
