import { User } from '../../user/entities/user.entity';
import { UserRole } from '../../userRole/entities/user_role.entity';
import { DEFAULT_AVATAR_IMAGE_URL } from '../../../common/constants/constants';
import { FileUtilityService } from '../../../config/files/utility/file-utility.service';

export class SenderSerializer {
  static serialize(fileUtilityService: FileUtilityService, data?: User) {
    if (!data) return null;

    // get the id.
    let userId: number = data.id;
    let username: string | undefined;
    let isOrganizer: boolean = false;
    let avatar: string | undefined;

    switch (+data.userRoleId) {
      case +UserRole.ATTENDEE:
        const attendeeFirstname: string | undefined = data.attendee?.firstName;
        const attendeeLastname: string | undefined = data.attendee?.lastName;

        // set full name
        if (attendeeFirstname && attendeeLastname) {
          username = attendeeFirstname + ' ' + attendeeLastname;
        } else {
          // default is the user's name.
          username = data.username;
        }

        avatar =
          fileUtilityService.getFileUrl(data.attendee?.profilePictureUrl) ??
          fileUtilityService.getFileUrl(DEFAULT_AVATAR_IMAGE_URL)!;

        isOrganizer = false;
        break;
      case +UserRole.EMPLOYEE:
        const empFirstname: string | undefined = data.employee?.first_name;
        const empLastname: string | undefined = data.employee?.last_name;

        // set full name
        if (empFirstname && empLastname) {
          username = empFirstname + ' ' + empLastname;
        } else {
          // default is the user's name.
          username = data.username;
        }

        isOrganizer = true;

        avatar =
          fileUtilityService.getFileUrl(data.employee?.profile_picture) ??
          fileUtilityService.getFileUrl(DEFAULT_AVATAR_IMAGE_URL)!;

        break;
    }

    return {
      user_id: userId,
      username: username,
      avatar: avatar!,
      is_organizer: isOrganizer,
    };
  }
}
