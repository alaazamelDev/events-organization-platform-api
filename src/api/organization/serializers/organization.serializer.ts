import { Organization } from '../entities/organization.entity';
import { FileUtilityService } from '../../../config/files/utility/file-utility.service';

export class OrganizationSerializer {
  static serialize(
    data?: Organization,
    fileUtilityService?: FileUtilityService,
  ) {
    if (!data) return null;
    return {
      id: data.id,
      name: data.name,
      bio: data.bio,
      description: data.description,
      cover_picture:
        fileUtilityService != undefined
          ? fileUtilityService.getFileUrl(data.cover_picture)
          : data.cover_picture,
      main_picture:
        fileUtilityService != undefined
          ? fileUtilityService.getFileUrl(data.main_picture)
          : data.main_picture,
      // TODO:ADD IMAGES
    };
  }
}
