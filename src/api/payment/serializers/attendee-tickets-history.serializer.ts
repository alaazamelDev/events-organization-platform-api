import { omitBy, isNil } from 'lodash';
import { FileUtilityService } from '../../../config/files/utility/file-utility.service';
import { GroupMessage } from '../../chat/entities/group-message.entity';

export class AttendeeTicketsHistorySerializer {
  static serialize(history: any) {
    return omitBy(history, isNil);
  }

  static serializeList(data: any[]) {
    return data.map((item) => omitBy(item, isNil));
  }
}
