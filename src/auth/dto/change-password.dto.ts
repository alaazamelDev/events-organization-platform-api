import { IsExist } from '../../common/decorators/is_exist.decorator';
import { IsDefined, IsString } from 'class-validator';

export class ChangePasswordDto {
  @IsDefined()
  @IsExist({
    tableName: 'user_roles',
    column: 'id',
  })
  role_id: number;

  @IsDefined()
  @IsString()
  old_password: string;

  @IsDefined()
  @IsString()
  new_password: string;
}
