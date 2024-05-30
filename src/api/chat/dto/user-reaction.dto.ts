import { IsExist } from '../../../common/decorators/is_exist.decorator';
import { IsDefined } from 'class-validator';

export class UserReactionDto {
  @IsDefined()
  @IsExist({ tableName: 'chat_groups', column: 'id' })
  group_id: number;

  @IsDefined()
  @IsExist({ tableName: 'group_messages', column: 'id' })
  message_id: number;

  @IsDefined()
  @IsExist({ tableName: 'reactions', column: 'id' })
  reaction_id: number;
}
