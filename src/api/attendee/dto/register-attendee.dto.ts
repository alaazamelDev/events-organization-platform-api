import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterAttendeeDto {
  @IsString()
  @MinLength(3)
  first_name: string;

  @IsString()
  @MinLength(3)
  last_name: string;

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
