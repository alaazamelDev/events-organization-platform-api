import { IsNotEmpty } from 'class-validator';
import { IsExist } from '../../../common/decorators/is_exist.decorator';

export class RemovePermissionDto {
  @IsNotEmpty()
  @IsExist({ tableName: 'permissions', column: 'id' })
  permission_id: number;
}
