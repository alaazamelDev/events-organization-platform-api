import { EventTag } from '../entities/event-tag.entity';
import { TagSerializer } from '../../tag/serializers/tag.serializer';

export class EventTagSerializer {
  static serialize(eventTag: EventTag) {
    return {
      event_tag_id: eventTag.id,
      tag: TagSerializer.serialize(eventTag.tag),
    };
  }

  static serializeList(eventTags: EventTag[]) {
    return eventTags.map((tag) => this.serialize(tag));
  }
}
