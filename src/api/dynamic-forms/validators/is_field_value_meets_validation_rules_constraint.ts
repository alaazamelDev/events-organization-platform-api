import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { EntityManager } from 'typeorm';
import { FillFormFieldDto } from '../dto/fill-form/fill-form-field.dto';
import { ValidationRule } from '../entities/validation-rule.entity';
import { ValidationRuleEnum } from '../enums/validation-rule.enum';

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

    const result = rules.map((rule) => {
      switch (rule.rule) {
        case ValidationRuleEnum.MIN:
          return +_value >= +rule.value;
        case ValidationRuleEnum.MAX:
          return +_value <= +rule.value;
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
