import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateFormFieldDto } from './create-form-field.dto';

export class CreateFormGroupDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsInt()
  position: number;

  @IsNotEmpty()
  @Type(() => CreateFormFieldDto)
  @ValidateNested({ each: true })
  fields: CreateFormFieldDto[];
}
