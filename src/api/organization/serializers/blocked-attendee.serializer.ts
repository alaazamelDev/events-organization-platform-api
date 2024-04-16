import { BlockedAttendee } from '../entities/blocked-attendee.entity';
import { AttendeeDetailsSerializer } from '../../attendee/serializers/attendee-details.serializer';
import * as moment from 'moment';
import { DEFAULT_DB_DATETIME_FORMAT } from '../../../common/constants/constants';
import { FileUtilityService } from '../../../config/files/utility/file-utility.service';

export class BlockedAttendeeSerializer {
  static serialize(
    data?: BlockedAttendee,
    fileUtilityService?: FileUtilityService,
  ) {
    if (!data) {
      return null;
    }
    return {
      attendee: AttendeeDetailsSerializer.serialize(
        data.attendee,
        fileUtilityService,
      ),
      blocked_by: data.blockedBy
        ? {
            id: data.blockedBy.id,
            username: data.blockedBy.username,
          }
        : null,
      blocking_date: moment(data.createdAt).format(DEFAULT_DB_DATETIME_FORMAT),
    };
  }

  static serializeList(
    data?: BlockedAttendee[],
    fileUtilityService?: FileUtilityService,
  ) {
    return (data ?? []).map((item) => this.serialize(item, fileUtilityService));
  }
}
