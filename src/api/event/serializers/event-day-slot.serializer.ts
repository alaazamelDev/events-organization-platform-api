import { EventDaySlot } from '../entities/event-day-slot.entity';
import { SlotStatusSerializer } from '../../slot-status/serializers/slot-status.serializer';
import * as moment from 'moment';
import { DEFAULT_DB_DATETIME_FORMAT } from '../../../common/constants/constants';

export class EventDaySlotSerializer {
  static serialize(data: EventDaySlot) {
    return {
      label: data.label,
      start_time: moment(data.startTime).format(DEFAULT_DB_DATETIME_FORMAT),
      end_time: moment(data.endTime).format(DEFAULT_DB_DATETIME_FORMAT),
      slot_status: SlotStatusSerializer.serialize(data.slotStatus),
    };
  }

  static serializeList(data?: EventDaySlot[]) {
    if (!data) return [];
    return data.map((item) => this.serialize(item));
  }
}
