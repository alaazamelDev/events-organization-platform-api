import { EventDay } from '../entities/event-day.entity';
import { EventDayType } from '../enums/event-day-type.enum';
import { DEFAULT_DB_DATETIME_FORMAT } from '../../../common/constants/constants';
import * as moment from 'moment';
import { EventDaySlotSerializer } from './event-day-slot.serializer';

export class EventDaySerializer {
  static serialize(data: EventDay) {
    return {
      day_date: data.dayDate,
      type: data.startTime ? EventDayType.oneTime : EventDayType.multipleTimes,
      start_time: data.startTime
        ? moment(data.startTime).format(DEFAULT_DB_DATETIME_FORMAT)
        : null,
      end_time: data.endTime
        ? moment(data.endTime).format(DEFAULT_DB_DATETIME_FORMAT)
        : null,
      slots: EventDaySlotSerializer.serializeList(data.slots),
    };
  }

  static serializeList(data: EventDay[]) {
    return data.map((item) => this.serialize(item));
  }
}
