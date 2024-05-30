import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { CreateRuleDto } from '../dto/create-rule.dto';

@ValidatorConstraint({
  name: 'MultipleConditionsOnTheSameDefinedDataInOneRuleConstraint',
  async: true,
})
export class MultipleConditionsOnTheSameDefinedDataInOneRuleConstraint
  implements ValidatorConstraintInterface
{
  constructor() {}

  async validate(_text: any, _args: ValidationArguments) {
    const object = _args.object as CreateRuleDto;
    const conditions = object.conditions;

    const seen = new Set<string>();
    const result = conditions.some((condition) => {
      if (seen.has(String(condition.defined_data_id))) {
        return true;
      }

      seen.add(String(condition.defined_data_id));
      return false;
    });

    return !result;
  }

  defaultMessage(_args: ValidationArguments) {
    return `the provided conditions share the same defined data`;
  }
}
