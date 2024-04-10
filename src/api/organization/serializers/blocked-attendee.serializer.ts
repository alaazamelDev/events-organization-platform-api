import { BlockedAttendee } from '../entities/blocked-attendee.entity';
import { AttendeeDetailsSerializer } from '../../attendee/serializers/attendee-details.serializer';
import * as moment from 'moment';
import { DEFAULT_DB_DATETIME_FORMAT } from '../../../common/constants/constants';

export class BlockedAttendeeSerializer {
  static serialize(data?: BlockedAttendee) {
    if (!data) {
      return null;
    }
    return {
      attendee: AttendeeDetailsSerializer.serialize(data.attendee),
      blocked_by: data.blockedBy
        ? {
            id: data.blockedBy.id,
            username: data.blockedBy.username,
          }
        : null,
      blocking_date: moment(data.createdAt).format(DEFAULT_DB_DATETIME_FORMAT),
    };
  }

  static serializeList(data?: BlockedAttendee[]) {
    return (data ?? []).map((item) => this.serialize(item));
  }
}
