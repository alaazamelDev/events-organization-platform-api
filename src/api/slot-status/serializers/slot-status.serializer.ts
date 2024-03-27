import { SlotStatus } from '../entities/slot-status.entity';

export class SlotStatusSerializer {
  static serialize(data?: SlotStatus) {
    if (!data) return null;
    return {
      value: data.id,
      label: data.statusName,
    };
  }

  static serializeList(data: SlotStatus[]) {
    return data.map((item) => this.serialize(item));
  }
}
