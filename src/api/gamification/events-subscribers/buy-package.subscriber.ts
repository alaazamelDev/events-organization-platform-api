import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import { AttendeesTickets } from '../../payment/entities/attendees-tickets.entity';
import { TicketsEventTypes } from '../../payment/constants/tickets-event-types.constant';
import { InsertedDataEntity } from '../entities/data-insertion/inserted-data.entity';
import { DefinedDataEnum } from '../constants/defined-data.constant';

@EventSubscriber()
export class BuyPackageSubscriber
  implements EntitySubscriberInterface<AttendeesTickets>
{
  listenTo(): Function | string {
    return AttendeesTickets;
  }

  async afterInsert(event: InsertEvent<AttendeesTickets>): Promise<any> {
    const ticket_event = event.entity;

    if (ticket_event.event_type_id == TicketsEventTypes.PURCHASE) {
      await event.queryRunner.manager.getRepository(InsertedDataEntity).insert({
        attendee_id: +ticket_event.attendee.id,
        defined_data_id: DefinedDataEnum.BUY_PACKAGE,
        value: 1,
      });
    }
  }
}
