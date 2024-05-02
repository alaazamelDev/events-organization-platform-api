import { Reaction } from '../entities/reaction.entity';
import { FileUtilityService } from '../../../config/files/utility/file-utility.service';

export class ReactionSerializer {
  static serialize(fileUtilityService: FileUtilityService, data?: Reaction) {
    if (!data) return null;
    return {
      id: data.id,
      label: data.label,
      icon: fileUtilityService.getFileUrl(data.icon),
    };
  }

  static serializeList(
    fileUtilityService: FileUtilityService,
    data?: Reaction[],
  ) {
    if (!data) return [];
    return data.map((item) => this.serialize(fileUtilityService, item));
  }
}
