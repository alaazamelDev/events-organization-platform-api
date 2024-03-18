import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsString({
    message: 'Username must be string.',
  })
  username!: string;

  @IsNotEmpty({
    message: 'Password cannot be empty',
  })
  password: string;
}
