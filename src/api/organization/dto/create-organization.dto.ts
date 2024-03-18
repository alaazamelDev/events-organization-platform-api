import { IsDateString, IsOptional, IsString } from 'class-validator';

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
  username: string;

  @IsString()
  email: string;

  @IsString()
  password: string;
}
