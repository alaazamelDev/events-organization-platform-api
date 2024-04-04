import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { CreateFormFieldValidationRuleDto } from '../dto/create-form/create-form-field-validation-rule.dto';
import { rulesRequiresNumber } from '../constants/constants';

@ValidatorConstraint({
  name: 'IsValidationRuleValueSuitsTheFieldConstraint',
  async: true,
})
export class IsValidationRuleValueSuitsTheFieldConstraint
  implements ValidatorConstraintInterface
{
  async validate(_value: any, _args: ValidationArguments) {
    const object = _args.object as CreateFormFieldValidationRuleDto;

    if (rulesRequiresNumber.includes(object.rule)) {
      return !isNaN(+_value);
    }

    return true;
  }

  defaultMessage(_args: ValidationArguments) {
    const object = _args.object as CreateFormFieldValidationRuleDto;
    return `${object.rule} validation rule value is incorrect`;
  }
}
