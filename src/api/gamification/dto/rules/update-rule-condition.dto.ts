import { PartialType } from '@nestjs/swagger';
import { CreateRuleConditionDto } from './create-rule-condition.dto';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  Min,
  Validate,
} from 'class-validator';
import { IsExist } from '../../../../common/decorators/is_exist.decorator';
import { DoesOperatorSupportDefinedDataConstraint } from '../../validators/does_operator_support_defined_data_constraint';

export class UpdateRuleConditionDto extends PartialType(
  CreateRuleConditionDto,
) {
  @IsNotEmpty()
  @IsExist({ tableName: 'g_rules_conditions', column: 'id' })
  rule_condition_id: number;

  @IsOptional()
  @IsExist({ tableName: 'g_defined_data', column: 'id' })
  defined_data_id: number;

  @IsOptional()
  @IsExist({ tableName: 'g_operators', column: 'id' })
  @Validate(DoesOperatorSupportDefinedDataConstraint)
  operator_id: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  value: number;

  @IsOptional()
  @IsDateString()
  time: string;
}
