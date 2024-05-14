import { IsDefined, IsNotEmpty, IsString } from 'class-validator';
import { IsExist } from '../../common/decorators/is_exist.decorator';

export class LoginDto {
  @IsString({ message: 'Username must be string.' })
  username!: string;

  @IsNotEmpty({ message: 'Password cannot be empty' })
  password: string;

  @IsDefined()
  @IsExist({ tableName: 'user_roles', column: 'id' })
  role_id: number;
}
