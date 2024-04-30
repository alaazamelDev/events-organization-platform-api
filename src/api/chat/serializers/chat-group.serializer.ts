import { ChatGroup } from '../entities/chat-group.entity';
import { MessageGroupStatus } from '../enums/message-group-status.enum';

export class ChatGroupSerializer {
  static serialize(data?: ChatGroup) {
    if (!data) {
      return null;
    }
    return {
      id: data.id,
      title: data.groupTitle,
      status: MessageGroupStatus[data.status],
      member_count: data.memberCount,
    };
  }

  static serializeList(data?: ChatGroup[]) {
    return !data ? null : data.map((item) => this.serialize(item));
  }
}
