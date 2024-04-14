import { PartialType } from '@nestjs/swagger';
import { CreateFormFieldDto } from '../create-form/create-form-field.dto';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  Validate,
} from 'class-validator';
import { IsExist } from '../../../../common/decorators/is_exist.decorator';
import { IsGroupBelongsToTheFieldFormConstraint } from '../../validators/is_group_belongs_to_the_field_form_constraint';

export class UpdateFormFieldDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  label: string;

  @IsOptional()
  @IsBoolean()
  required: boolean;

  @IsOptional()
  @IsInt()
  @Min(1)
  position: number;

  @IsOptional()
  @IsExist({ tableName: 'form_groups', column: 'id' })
  @Validate(IsGroupBelongsToTheFieldFormConstraint)
  group_id: number;

  @IsNotEmpty()
  @IsExist({ tableName: 'form_fields', column: 'id' })
  field_id: number;
}
