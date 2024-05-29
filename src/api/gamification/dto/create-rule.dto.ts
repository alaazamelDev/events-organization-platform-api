import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateRuleConditionDto } from './create-rule-condition.dto';
import { Type } from 'class-transformer';
import { AssignRewardToRuleDto } from './assign-reward-to-rule.dto';

export class CreateRuleDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => CreateRuleConditionDto)
  @ValidateNested({ each: true })
  conditions: CreateRuleConditionDto[];

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => AssignRewardToRuleDto)
  @ValidateNested({ each: true })
  rewards: AssignRewardToRuleDto[];
}
