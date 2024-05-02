import { ChatGroupSerializer } from './chat-group.serializer';
import { FileUtilityService } from '../../../config/files/utility/file-utility.service';
import { GroupMessageSerializer } from './group-message.serializer';

export class GroupDetailsSerializer {
  static serialize(fileUtilityService: FileUtilityService, data?: any) {
    if (!data) return null;
    return {
      group: ChatGroupSerializer.serialize(data.group),
      messages: GroupMessageSerializer.serializeList(
        fileUtilityService,
        data.messages,
      ),
      meta_data: data.meta_data,
    };
  }
}
