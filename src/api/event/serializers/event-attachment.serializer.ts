import { EventAttachment } from '../entities/event-attachment.entity';
import { FileUtilityService } from '../../../config/files/utility/file-utility.service';

export class EventAttachmentSerializer {
  static serialize(
    data: EventAttachment,
    fileUtilityService: FileUtilityService,
  ) {
    return {
      id: data.id,
      file_name: data.fileName,
      file_url: fileUtilityService.getFileUrl(data.fileUrl),
    };
  }

  static serializeList(
    data: EventAttachment[],
    fileUtilityService: FileUtilityService,
  ) {
    if (!data) return null;
    return data.map((item) => this.serialize(item, fileUtilityService));
  }
}
