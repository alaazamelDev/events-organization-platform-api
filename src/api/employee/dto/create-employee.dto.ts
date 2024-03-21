import { IsDateString, IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { IsUnique } from '../../../common/decorators/is_unique.decorator';

export class CreateEmployeeDto {
  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsString()
  phone_number: string;

  @IsDateString()
  birth_date: Date;

  @IsNotEmpty()
  organization_id: number;

  @IsNotEmpty()
  @IsUnique({ tableName: 'users', column: 'username' })
  username: string;

  @IsEmail()
  @IsUnique({ tableName: 'users', column: 'email' })
  email: string;

  @IsNotEmpty()
  password: string;

  // TODO, update the validation rule to take array of AddPermissionDTO
  @IsNotEmpty()
  permissions: [number];
}
