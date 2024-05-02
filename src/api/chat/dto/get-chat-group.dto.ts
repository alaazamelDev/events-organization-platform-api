import { IsExist } from '../../../common/decorators/is_exist.decorator';
import { IsDefined } from 'class-validator';

export class GetChatGroupDto {
  @IsDefined()
  @IsExist({ tableName: 'chat_groups', column: 'id' })
  group_id: number;
}
