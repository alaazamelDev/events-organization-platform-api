import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { IsExist } from '../../../../common/decorators/is_exist.decorator';
import { CreateFormFieldOptionDto } from './create-form-field-option.dto';
import { Type } from 'class-transformer';
import { CreateFormFieldValidationRuleDto } from './create-form-field-validation-rule.dto';
import {
  fieldTypesWithOptions,
  fieldTypesWithValidationRules,
} from '../../constants/constants';

export class CreateFormFieldDto {
  @IsString()
  name: string;

  @IsString()
  label: string;

  @IsBoolean()
  required: boolean;

  @IsInt()
  @Min(1)
  position: number;

  @IsExist({ tableName: 'field_types', column: 'id' })
  type_id: number;

  @ValidateIf((body) => fieldTypesWithOptions.includes(body.type_id))
  @IsArray()
  @Type(() => CreateFormFieldOptionDto)
  @ValidateNested({ each: true })
  @ArrayMinSize(2)
  options: CreateFormFieldOptionDto[] = [];

  @ValidateIf((body) => fieldTypesWithValidationRules.includes(body.type_id))
  @IsOptional()
  @IsArray()
  @Type(() => CreateFormFieldValidationRuleDto)
  @ValidateNested({ each: true })
  validation_rules: CreateFormFieldValidationRuleDto[] = [];
}
