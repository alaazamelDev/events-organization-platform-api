import { EventDay } from '../entities/event-day.entity';
import { EventDaySlotSerializer } from './event-day-slot.serializer';

export class EventDaySerializer {
  static serialize(data: EventDay) {
    return {
      day_date: data.dayDate,
      slots: EventDaySlotSerializer.serializeList(data.slots),
    };
  }

  static serializeList(data: EventDay[]) {
    return data.map((item) => this.serialize(item));
  }
}
