import { Reaction } from '../entities/reaction.entity';

export class ReactionSerializer {
  static serialize(data?: Reaction) {
    if (!data) return null;
    return {
      id: data.id,
      label: data.label,
      icon: data.icon,
    };
  }

  static serializeList(data?: Reaction[]) {
    if (!data) return [];
    return data.map((item) => this.serialize(item));
  }
}
