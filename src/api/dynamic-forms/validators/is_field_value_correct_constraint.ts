import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { FillFormDto } from '../dto/fill-form.dto';
import { EntityManager } from 'typeorm';
import { FormField } from '../entities/form-field.entity';
import { FillFormFieldDto } from '../dto/fill-form-field.dto';
import {
  FIELD_TYPE,
  fieldTypesWithOptions,
} from '../dto/create-form-field.dto';
import * as moment from 'moment';

@ValidatorConstraint({ name: 'fieldValueCorrect', async: true })
export class IsFieldValueCorrectConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly entityManager: EntityManager) {}

  async validate(_value: any, _args: ValidationArguments) {
    const object = _args.object as FillFormFieldDto;

    const field_type = await this.entityManager
      .getRepository(FormField)
      .createQueryBuilder('field')
      .where('field.id = :id', { id: +object.field_id })
      .getOneOrFail();

    if (fieldTypesWithOptions.includes(+field_type.fieldTypeId)) {
      return true;
    } else if (+field_type.fieldTypeId === FIELD_TYPE.NUMBER) {
      return !isNaN(+_value);
    } else if (+field_type.fieldTypeId === FIELD_TYPE.DATE) {
      return moment(_value, 'YYYY-MM-DD', true).isValid();
    }
    return true;
  }

  defaultMessage(_args: ValidationArguments) {
    const object = _args.object as FillFormFieldDto;
    return `${_args.property} must meet the field type for the field with id: ${object.field_id}`;
  }
}
