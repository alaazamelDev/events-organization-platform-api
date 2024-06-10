import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { EntityManager } from 'typeorm';
import { AddRuleConditionDto } from '../dto/rules/add-rule-condition.dto';
import { RuleConditionEntity } from '../entities/rules/rule-condition.entity';

@ValidatorConstraint({
  name: 'IsDefinedDataConditionAlreadyExistInTheSameRuleConstraint',
  async: true,
})
export class IsDefinedDataConditionAlreadyExistInTheSameRuleConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly entityManager: EntityManager) {}

  async validate(_text: any, _args: ValidationArguments) {
    const object = _args.object as AddRuleConditionDto;
    const rule_id = object.rule_id;
    const defined_data_id = object.defined_data_id;

    const result = await this.entityManager
      .getRepository(RuleConditionEntity)
      .createQueryBuilder('condition')
      .where('condition.rule = :ruleID', { ruleID: rule_id })
      .andWhere('condition.definedData = :definedDataID', {
        definedDataID: defined_data_id,
      })
      .getExists();

    return !result;
  }

  defaultMessage(_args: ValidationArguments) {
    return `there is already a condition that handles this defined data for this rule`;
  }
}
