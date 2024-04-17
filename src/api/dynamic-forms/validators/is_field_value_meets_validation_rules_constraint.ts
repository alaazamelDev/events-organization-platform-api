import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { EntityManager } from 'typeorm';
import { FillFormFieldDto } from '../dto/fill-form/fill-form-field.dto';
import { ValidationRule } from '../entities/validation-rule.entity';
import { ValidationRuleEnum } from '../enums/validation-rule.enum';
import { FIELD_TYPE } from '../enums/field-types.enum';
import { FormField } from '../entities/form-field.entity';

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

    const { fieldTypeId } = await this.entityManager
      .getRepository(FormField)
      .createQueryBuilder('field')
      .where('field.id = :id', { id: +object.field_id })
      .getOneOrFail();

    const rules = await this.entityManager
      .getRepository(ValidationRule)
      .createQueryBuilder('rule')
      .where('rule.form_field_id = :id', { id: +object.field_id })
      .getMany();

    const result = rules.map((rule) => {
      switch (rule.rule) {
        case ValidationRuleEnum.MIN:
          if (+fieldTypeId === +FIELD_TYPE.NUMBER)
            return +_value >= +rule.value;
          else if (+fieldTypeId === +FIELD_TYPE.TEXT)
            return _value.length >= +rule.value;
          return false;
        case ValidationRuleEnum.MAX:
          if (+fieldTypeId === +FIELD_TYPE.NUMBER)
            return +_value <= +rule.value;
          else if (+fieldTypeId === +FIELD_TYPE.TEXT)
            return _value.length <= +rule.value;
          return false;
        default:
          return true;
      }
    });

    return !result.includes(false);
  }

  defaultMessage(_args: ValidationArguments) {
    return `value does not meet the constraints`;
  }
}
