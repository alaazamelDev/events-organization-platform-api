import { CreateRuleConditionDto } from './create-rule-condition.dto';
import { IsNotEmpty, Validate } from 'class-validator';
import { IsExist } from '../../../common/decorators/is_exist.decorator';
import { IsDefinedDataConditionAlreadyExistInTheSameRuleConstraint } from '../validators/is_defined_data_condition_already_exist_in_the_same_rule_constraint';

export class AddRuleConditionDto extends CreateRuleConditionDto {
  @IsNotEmpty()
  @IsExist({ tableName: 'g_rules', column: 'id' })
  @Validate(IsDefinedDataConditionAlreadyExistInTheSameRuleConstraint)
  rule_id: number;
}
