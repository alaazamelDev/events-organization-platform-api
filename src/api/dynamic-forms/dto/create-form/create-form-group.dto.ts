import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
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
  @Min(1)
  position: number;

  @IsNotEmpty()
  @Type(() => CreateFormFieldDto)
  @ValidateNested({ each: true })
  fields: CreateFormFieldDto[];
}
