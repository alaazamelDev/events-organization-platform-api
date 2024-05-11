import { IsOptional, IsString } from 'class-validator';
import { IsExist } from '../../../common/decorators/is_exist.decorator';

export class SentMessageDto {
  @IsString()
  content: string;

  @IsExist({ tableName: 'chat_groups', column: 'id' })
  group_id: number;

  @IsOptional()
  @IsExist({ tableName: 'group_messages', column: 'id' })
  reply_to?: number;
}
