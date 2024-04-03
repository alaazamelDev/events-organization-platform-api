import { EventDaySlotSerializer } from './event-day-slot.serializer';
import { EventDay } from '../../event-day/entities/event-day.entity';

export class EventDaySerializer {
  static serialize(data: EventDay) {
    return {
      id: data.id,
      day_date: data.dayDate,
      slots: EventDaySlotSerializer.serializeList(data.slots),
    };
  }

  static serializeList(data: EventDay[]) {
    return data.map((item) => this.serialize(item));
  }
}
