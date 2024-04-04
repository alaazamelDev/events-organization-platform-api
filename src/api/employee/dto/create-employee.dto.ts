import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { IsUnique } from '../../../common/decorators/is_unique.decorator';
import { IsExist } from '../../../common/decorators/is_exist.decorator';
import { IsDateFormat } from '../../../common/decorators/is-date-format.decorator';
import { AddPermissionDto } from './add-permission.dto';
import { Type } from 'class-transformer';

export class CreateEmployeeDto {
  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsString()
  phone_number: string;

  @IsDateFormat('YYYY-MM-DD')
  birth_date: string;

  @IsNotEmpty()
  @IsExist({ tableName: 'organizations', column: 'id' })
  organization_id: number;

  @IsNotEmpty()
  @IsUnique({ tableName: 'users', column: 'username' })
  username: string;

  @IsEmail()
  @IsUnique({ tableName: 'users', column: 'email' })
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @Type(() => AddPermissionDto)
  @ValidateNested({ each: true })
  permissions: AddPermissionDto[];
}
