import { AttendeeDetailsSerializer } from '../../attendee/serializers/attendee-details.serializer';
import { DEFAULT_DB_DATETIME_FORMAT } from '../../../common/constants/constants';
import { FollowingAttendee } from '../entities/following-attendee.entity';
import * as moment from 'moment';

export class FollowingAttendeeSerializer {
  static serialize(data?: FollowingAttendee) {
    if (!data) {
      return null;
    }
    return {
      attendee: AttendeeDetailsSerializer.serialize(data.attendee),
      following_date: moment(data.createdAt).format(DEFAULT_DB_DATETIME_FORMAT),
    };
  }

  static serializeList(data?: FollowingAttendee[]) {
    return (data ?? []).map((item) => this.serialize(item));
  }
}
