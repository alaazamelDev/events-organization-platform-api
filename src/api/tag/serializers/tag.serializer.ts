import { Tag } from '../entities/tag.entity';

export class TagSerializer {
  static serialize(tag: Tag): { value: number; label: string } {
    return {
      value: tag.id,
      label: tag.tagName,
    };
  }

  static serializeList(tags: Tag[]): { value: number; label: string }[] {
    return tags.map((tag) => this.serialize(tag));
  }
}
