export class CreateUserDto {
  email!: string;
  username!: string;
  password!: string;
  role_id!: number;
  refreshToken?: string;
}
