import { MessageGroupStatus } from '../enums/message-group-status.enum';

export class ChatListItemSerializer {
  // 'attendee_event.attendee_id AS attendee_id',
  // 'events.id AS event_id',
  // 'cg.id AS chat_group_id',
  // 'cg.group_title AS group_title',
  // 'COALESCE(group_counts.group_members, 0) AS group_members',
  // 'cg.group_status AS group_status',

  static serialize(data?: any) {
    if (!data) {
      return null;
    }
    return {
      event_id: data.event_id,
      chat_group_id: data.chat_group_id,
      group_title: data.group_title,
      group_members_count: data.group_members_count,
      group_status: data.group_status
        ? MessageGroupStatus[data.group_status]
        : null,
    };
  }

  static serializeList(data?: any[]) {
    return !data ? null : data.map((item) => this.serialize(item));
  }
}
