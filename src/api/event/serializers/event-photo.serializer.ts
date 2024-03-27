import { EventPhoto } from '../entities/event-photo.entity';
import { FileUtilityService } from '../../../config/files/utility/file-utility.service';

export class EventPhotoSerializer {
  static serialize(data: EventPhoto, fileUtilityService: FileUtilityService) {
    return {
      id: data.id,
      photo_name: data.photoName,
      photo_url: fileUtilityService.getFileUrl(data.photoUrl),
    };
  }

  static serializeList(
    fileUtilityService: FileUtilityService,
    data?: EventPhoto[],
  ) {
    if (!data) return null;
    return data.map((item) => this.serialize(item, fileUtilityService));
  }
}
