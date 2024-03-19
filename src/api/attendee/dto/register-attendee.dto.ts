import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class RegisterAttendeeDto {
  @IsString()
  @MinLength(3)
  first_name: string;

  @IsString()
  @MinLength(3)
  last_name: string;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  birth_date: Date;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  // TODO: WORK ON IT LATER.
  // @EmailNotRegistered({ message: 'email already registered' })
  email!: string;

  @IsString()
  @MinLength(8)
  password: string;
}
