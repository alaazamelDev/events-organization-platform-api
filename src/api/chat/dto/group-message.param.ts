import { IsDefined } from 'class-validator';
import { IsExist } from '../../../common/decorators/is_exist.decorator';

export class GroupMessageParam {
  @IsDefined()
  @IsExist({ tableName: 'group_messages', column: 'id' })
  id: number;
}
