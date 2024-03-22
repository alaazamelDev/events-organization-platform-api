import {
  IsDefined,
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { IsExist } from '../../../common/decorators/is_exist.decorator';
import { IsDateFormat } from '../../../common/decorators/is-date-format.decorator';
import { REGION } from '../../../common/constants/constants';
import { IsUnique } from '../../../common/decorators/is_unique.decorator';
import { Type } from 'class-transformer';
import { AttendeeContactDto } from './attendee-contact.dto';

export class RegisterAttendeeDto {
  @IsDefined({ message: 'This field is required' })
  @IsString()
  @MinLength(3)
  first_name: string;

  @IsDefined({ message: 'This field is required' })
  @IsString()
  @MinLength(3)
  last_name: string;

  @IsDefined({ message: 'This field is required' })
  @IsString()
  @IsUnique({ tableName: 'users', column: 'username' })
  username: string;

  @IsDefined({ message: 'This field is required' })
  @IsEmail()
  @IsUnique({ tableName: 'users', column: 'email' })
  email!: string;

  @IsDefined({ message: 'This field is required' })
  @IsString()
  @MinLength(8)
  password: string;

  @IsOptional()
  @IsExist({ tableName: 'jobs', column: 'id' })
  job_id?: number;

  @IsOptional()
  @IsExist({ tableName: 'addresses', column: 'id' })
  address_id?: number;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsOptional()
  @IsDateFormat('DD-MM-YYYY')
  birth_date?: Date;

  @IsOptional()
  @IsPhoneNumber(REGION)
  phone_number?: string;

  @IsOptional()
  @Type(() => AttendeeContactDto)
  @ValidateNested({ each: true })
  contacts: AttendeeContactDto[];

  // ADDITIONAL DATA FIELDS
  profile_img?: string;
  cover_img?: string;
}
