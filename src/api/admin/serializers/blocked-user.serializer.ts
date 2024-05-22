import { BlockedUser } from '../entities/blocked-user.entity';
import { UserRole } from '../../userRole/entities/user_role.entity';
import { Attendee } from '../../attendee/entities/attendee.entity';
import * as moment from 'moment';
import { DEFAULT_DB_DATETIME_FORMAT } from '../../../common/constants/constants';
import { AttendeeDetailsSerializer } from '../../attendee/serializers/attendee-details.serializer';
import { FileUtilityService } from '../../../config/files/utility/file-utility.service';

export class BlockedUserSerializer {
  static serialize(
    data?: BlockedUser,
    fileUtilityService?: FileUtilityService,
  ) {
    if (!data) return undefined;
    const roleId = +data?.userRoleId!;
    let payload;
    let key: string = 'user';
    switch (roleId) {
      case +UserRole.ATTENDEE:
        key = 'attendee';
        const attendee: Attendee = data.user.attendee!;
        payload = AttendeeDetailsSerializer.serialize(
          attendee,
          fileUtilityService,
        );
        break;
      // TODO: IMPLEMENT OTHER CASES
      default:
        payload = undefined;
    }
    return !payload
      ? undefined
      : {
          [key]: payload,
          blocked_at: moment(data.createdAt).format(DEFAULT_DB_DATETIME_FORMAT),
        };
  }

  static serializeList(
    data?: BlockedUser[],
    fileUtilityService?: FileUtilityService,
  ) {
    if (!data) return [];
    return data.map((item) => this.serialize(item, fileUtilityService));
  }
}
