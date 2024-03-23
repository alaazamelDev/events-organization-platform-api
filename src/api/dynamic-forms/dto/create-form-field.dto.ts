import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { IsExist } from '../../../common/decorators/is_exist.decorator';
import { CreateFormFieldOptionDto } from './create-form-field-option.dto';
import { Type } from 'class-transformer';

export enum FIELD_TYPE {
  TEXT = 1,
  NUMBER = 2,
  DATE = 3,
  RADIO_BUTTON = 4,
}

export class CreateFormFieldDto {
  @IsString()
  name: string;

  @IsString()
  label: string;

  @IsBoolean()
  required: boolean;

  @IsInt()
  position: number;

  @IsExist({ tableName: 'field_types', column: 'id' })
  type_id: number;

  @ValidateIf((body) => [FIELD_TYPE.RADIO_BUTTON].includes(body.type_id))
  @IsArray()
  @Type(() => CreateFormFieldOptionDto)
  @ValidateNested({ each: true })
  @ArrayMinSize(2)
  options: CreateFormFieldOptionDto[];
}
