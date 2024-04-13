import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IsExist } from '../../../../common/decorators/is_exist.decorator';
import { CreateFormGroupDto } from './create-form-group.dto';

export class CreateFormDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  // TODO, take the organization_id from the employee token who is performing the request
  @IsExist({ tableName: 'organizations', column: 'id' })
  organization_id: number;

  @IsNotEmpty()
  @Type(() => CreateFormGroupDto)
  @ValidateNested({ each: true })
  groups: CreateFormGroupDto[];
}
