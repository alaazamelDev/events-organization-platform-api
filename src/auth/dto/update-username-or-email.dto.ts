import { IsExist } from '../../common/decorators/is_exist.decorator';
import { IsDefined, IsOptional, IsString } from 'class-validator';
import { IsNotExist } from '../../common/decorators/is_not_exist.decorator';

export class UpdateUsernameOrEmailDto {
  @IsDefined()
  @IsExist({
    tableName: 'user_roles',
    column: 'id',
  })
  role_id: number;

  @IsOptional()
  @IsNotExist({
    tableName: 'users',
    column: 'username',
  })
  new_username: string;

  @IsOptional()
  @IsNotExist({
    tableName: 'users',
    column: 'email',
  })
  new_email: string;

  @IsDefined()
  @IsString()
  password: string;
}
