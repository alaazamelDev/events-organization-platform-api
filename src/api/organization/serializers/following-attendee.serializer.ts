import { AttendeeDetailsSerializer } from '../../attendee/serializers/attendee-details.serializer';
import { DEFAULT_DB_DATETIME_FORMAT } from '../../../common/constants/constants';
import { FollowingAttendee } from '../entities/following-attendee.entity';
import * as moment from 'moment';
import { OrganizationSerializer } from './organization.serializer';

export class FollowingAttendeeSerializer {
  static serialize(data?: FollowingAttendee) {
    if (!data) {
      return null;
    }

    if (data.attendee) {
      return {
        attendee: AttendeeDetailsSerializer.serialize(data.attendee),
        following_date: moment(data.createdAt).format(
          DEFAULT_DB_DATETIME_FORMAT,
        ),
      };
    } else {
      return {
        organization: OrganizationSerializer.serialize(data.organization),
        following_date: moment(data.createdAt).format(
          DEFAULT_DB_DATETIME_FORMAT,
        ),
      };
    }
  }

  static serializeList(data?: FollowingAttendee[]) {
    return (data ?? []).map((item) => this.serialize(item));
  }
}
