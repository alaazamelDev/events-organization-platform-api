import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { EntityManager } from 'typeorm';
import { FormField } from '../entities/form-field.entity';
import { FillFormFieldDto } from '../dto/fill-form/fill-form-field.dto';
import {
  FIELD_TYPE,
  fieldTypesWithOptions,
} from '../dto/create-form/create-form-field.dto';
import * as moment from 'moment';
import { ValidationRule } from '../entities/validation-rule.entity';

@ValidatorConstraint({
  name: 'IsFieldValueMeetsValidationRulesConstraint',
  async: true,
})
export class IsFieldValueMeetsValidationRulesConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly entityManager: EntityManager) {}

  async validate(_value: any, _args: ValidationArguments) {
    const object = _args.object as FillFormFieldDto;

    const rules = await this.entityManager
      .getRepository(ValidationRule)
      .createQueryBuilder('rule')
      .where('rule.form_field_id = :id', { id: +object.field_id })
      .getMany();

    // const field_type = await this.entityManager
    //   .getRepository(FormField)
    //   .createQueryBuilder('field')
    //   .where('field.id = :id', { id: +object.field_id })
    //   .getOneOrFail();
    //
    // if (fieldTypesWithOptions.includes(+field_type.fieldTypeId)) {
    //   return true;
    // } else if (+field_type.fieldTypeId === FIELD_TYPE.NUMBER) {
    //   return !isNaN(+_value);
    // } else if (+field_type.fieldTypeId === FIELD_TYPE.DATE) {
    //   return moment(_value, 'YYYY-MM-DD', true).isValid();
    // }
    return true;
  }

  // TODO, write the error message based on the validation rule
  defaultMessage(_args: ValidationArguments) {
    const object = _args.object as FillFormFieldDto;
    return `${_args.property} must meet the field type for the field with id: ${object.field_id}`;
  }
}
