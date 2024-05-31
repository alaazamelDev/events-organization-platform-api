import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import { GroupMessage } from '../../chat/entities/group-message.entity';
import { Attendee } from '../../attendee/entities/attendee.entity';
import { InsertedDataEntity } from '../entities/data-insertion/inserted-data.entity';
import { DefinedDataEnum } from '../constants/defined-data.constant';

@EventSubscriber()
export class SendMessageSubscriber
  implements EntitySubscriberInterface<GroupMessage>
{
  listenTo() {
    return GroupMessage;
  }

  async afterInsert(event: InsertEvent<GroupMessage>): Promise<any> {
    const message = event.entity;
    const user_id = +message.sender.id;
    const attendee = await event.queryRunner.manager
      .getRepository(Attendee)
      .createQueryBuilder('attendee')
      .where('attendee.user = :userID', { userID: user_id })
      .getOne();

    if (attendee) {
      await event.queryRunner.manager.getRepository(InsertedDataEntity).insert({
        attendee_id: attendee.id,
        defined_data_id: DefinedDataEnum.SEND_MESSAGE,
        value: 1,
      });
    }
  }
}
