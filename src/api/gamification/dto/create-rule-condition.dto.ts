import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  Min,
  Validate,
} from 'class-validator';
import { IsExist } from '../../../common/decorators/is_exist.decorator';
import { DoesOperatorSupportDefinedDataConstraint } from '../validators/does_operator_support_defined_data_constraint';

export class CreateRuleConditionDto {
  @IsNotEmpty()
  @IsExist({ tableName: 'g_defined_data', column: 'id' })
  defined_data_id: number;

  @IsNotEmpty()
  @IsExist({ tableName: 'g_operators', column: 'id' })
  @Validate(DoesOperatorSupportDefinedDataConstraint)
  operator_id: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  value: number;

  @IsOptional()
  @IsDateString()
  time: string;
}
