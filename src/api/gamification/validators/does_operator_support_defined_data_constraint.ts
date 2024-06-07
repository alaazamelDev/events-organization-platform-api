import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { EntityManager } from 'typeorm';
import { CreateRuleConditionDto } from '../dto/rules/create-rule-condition.dto';
import { DefinedDataOperatorsEntity } from '../entities/data-definition/defined-data-operators.entity';

@ValidatorConstraint({
  name: 'DoesOperatorSupportDefinedDataConstraint',
  async: true,
})
export class DoesOperatorSupportDefinedDataConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly entityManager: EntityManager) {}

  async validate(_text: any, _args: ValidationArguments) {
    const object = _args.object as CreateRuleConditionDto;
    const data_id = object.defined_data_id;
    const operator_id = object.operator_id;

    return this.entityManager
      .getRepository(DefinedDataOperatorsEntity)
      .createQueryBuilder('data_operator')
      .where('data_operator.defined_data_id = :dataID', { dataID: data_id })
      .andWhere('data_operator.operator_id = :operatorID', {
        operatorID: operator_id,
      })
      .getExists();
  }

  defaultMessage(_args: ValidationArguments) {
    const object = _args.object as CreateRuleConditionDto;
    return `provided operator ${object.operator_id} does not support this data ${object.defined_data_id}`;
  }
}
