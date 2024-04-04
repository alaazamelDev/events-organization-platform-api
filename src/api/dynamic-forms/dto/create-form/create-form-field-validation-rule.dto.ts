import { ValidationRuleEnum } from '../../enums/validation-rule.enum';
import { IsEnum, Validate } from 'class-validator';
import { IsValidationRuleValueSuitsTheFieldConstraint } from '../../validators/is_validation_rule_value_suits_the_field_constraint';

export class CreateFormFieldValidationRuleDto {
  @Validate(IsValidationRuleValueSuitsTheFieldConstraint)
  value: string;

  @IsEnum(ValidationRuleEnum)
  rule: ValidationRuleEnum;
}
