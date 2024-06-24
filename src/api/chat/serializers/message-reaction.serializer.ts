import { MessageReaction } from '../entities/message-reaction.entity';
import { ReactionSerializer } from './reaction.serializer';
import { FileUtilityService } from '../../../config/files/utility/file-utility.service';
import * as moment from 'moment';
import { DEFAULT_DB_DATETIME_FORMAT } from '../../../common/constants/constants';
import { SenderSerializer } from './sender.serializer';

export class MessageReactionSerializer {
  static serialize(
    fileUtilityService: FileUtilityService,
    data?: MessageReaction,
  ) {
    if (!data) return null;
    return {
      reacted_by: SenderSerializer.serialize(
        fileUtilityService,
        data.reactedBy,
      ),
      reaction: ReactionSerializer.serialize(data.reaction),
      reaction_date: moment(data.createdAt).format(DEFAULT_DB_DATETIME_FORMAT),
    };
  }

  static serializeList(
    fileUtilityService: FileUtilityService,
    data?: MessageReaction[],
  ) {
    if (!data) return [];
    return data.map((item) => this.serialize(fileUtilityService, item));
  }
}
