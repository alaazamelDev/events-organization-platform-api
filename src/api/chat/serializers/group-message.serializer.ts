import { GroupMessage } from '../entities/group-message.entity';
import * as moment from 'moment';
import { DEFAULT_DB_DATETIME_FORMAT } from '../../../common/constants/constants';
import { MessageReactionSerializer } from './message-reaction.serializer';
import { FileUtilityService } from '../../../config/files/utility/file-utility.service';
import { SenderSerializer } from './sender.serializer';

export class GroupMessageSerializer {
  static serialize(
    fileUtilityService: FileUtilityService,
    data?: GroupMessage,
  ): any {
    if (!data) return null;
    return {
      message_id: data.id,
      text: data.content,
      user: SenderSerializer.serialize(fileUtilityService, data.sender),
      timestamp: moment(data.createdAt).format(DEFAULT_DB_DATETIME_FORMAT),
      reactions: MessageReactionSerializer.serializeList(
        fileUtilityService,
        data.reactions,
      ),
      replied_message: data.repliedMessage
        ? {
            message_id: data.repliedMessage.id,
            message_content: data.repliedMessage.content,
          }
        : null,
    };
  }

  static serializeList(
    fileUtilityService: FileUtilityService,
    data?: GroupMessage[],
  ) {
    if (!data) return [];
    return data.map((item) => this.serialize(fileUtilityService, item));
  }
}
