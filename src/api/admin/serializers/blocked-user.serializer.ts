import { BlockedUser } from '../entities/blocked-user.entity';
import { UserRole } from '../../userRole/entities/user_role.entity';
import { Attendee } from '../../attendee/entities/attendee.entity';
import * as moment from 'moment';
import { DEFAULT_DB_DATETIME_FORMAT } from '../../../common/constants/constants';

export class BlockedUserSerializer {
  static serialize(data?: BlockedUser) {
    if (!data) return undefined;
    const roleId = data?.userRoleId!;
    let payload;
    switch (roleId) {
      case +UserRole.ATTENDEE:
        const attendee: Attendee = data.user.attendee!;
        payload = {
          attendee_id: attendee.id,
          full_name: attendee.firstName.concat(' ', attendee.lastName),
        };
        break;
      // TODO: IMPLEMENT OTHER CASES
      default:
        payload = undefined;
    }
    return !payload
      ? undefined
      : {
          payload: payload,
          blocked_at: moment(data.createdAt).format(DEFAULT_DB_DATETIME_FORMAT),
        };
  }

  static serializeList(data?: BlockedUser[]) {
    if (!data) return undefined;
    return data.map((item) => this.serialize(item));
  }
}
