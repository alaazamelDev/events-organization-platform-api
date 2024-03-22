import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { CreateFormFieldDto } from './create-form-field.dto';
import { Type } from 'class-transformer';
import { IsExist } from '../../../common/decorators/is_exist.decorator';

export class CreateFormDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  // TODO, take the organization_id from the employee token who is performing the request
  @IsExist({ tableName: 'organizations', column: 'id' })
  organization_id: number;

  @IsNotEmpty()
  @Type(() => CreateFormFieldDto)
  @ValidateNested({ each: true })
  fields: CreateFormFieldDto[];
}
