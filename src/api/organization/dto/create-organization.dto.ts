import { IsDateString, IsOptional, IsString } from 'class-validator';
import { IsUnique } from '../../../common/decorators/is_unique.decorator';

export class CreateOrganizationDto {
  @IsString()
  name: string;

  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsString()
  phone_number: string;

  @IsDateString()
  birth_date: Date;

  @IsOptional()
  profile_picture: string;

  @IsString()
  @IsUnique({ tableName: 'users', column: 'username' })
  username: string;

  @IsString()
  @IsUnique({ tableName: 'users', column: 'email' })
  email: string;

  @IsString()
  password: string;
}
