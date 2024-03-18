export class UpdateUserDto {
  id: number;
  email?: string;
  username?: string;
  password?: string;
  role_id?: number;
  refreshToken?: string;
}
