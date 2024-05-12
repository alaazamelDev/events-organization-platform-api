import { Admin } from '../entities/admin.entity';
import { FileUtilityService } from '../../../config/files/utility/file-utility.service';

export class AdminSerializer {
  static serialize(fileUtilityService: FileUtilityService, data?: Admin) {
    if (!data) return null;
    return {
      admin_id: data.id,
      first_name: data.firstName,
      last_name: data.lastName,
      phone_number: data.phoneNumber,
      profile_picture: data.profilePictureUrl
        ? fileUtilityService.getFileUrl(data.profilePictureUrl)
        : null,
    };
  }
}
