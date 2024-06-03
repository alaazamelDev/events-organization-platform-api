import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { CreateRuleDto } from '../dto/create-rule.dto';

@ValidatorConstraint({
  name: 'AreConditionsContainsAtLeastOneEqualOperatorConstraint',
  async: true,
})
export class AreConditionsContainsAtLeastOneEqualOperatorConstraint
  implements ValidatorConstraintInterface
{
  constructor() {}

  async validate(_text: any, _args: ValidationArguments) {
    const object = _args.object as CreateRuleDto;
    const conditions = object.conditions;

    const result = conditions.map((condition) => {
      return condition.operator_id === 1;
    });

    return result.includes(true);
  }

  defaultMessage(_args: ValidationArguments) {
    return `The Conditions must at least have one Equal operator`;
  }
}
