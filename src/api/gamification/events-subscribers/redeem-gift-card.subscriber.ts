import { DataSource, EntitySubscriberInterface, InsertEvent } from 'typeorm';
import { AttendeesTickets } from '../../payment/entities/attendees-tickets.entity';
import { TicketsEventTypes } from '../../payment/constants/tickets-event-types.constant';
import { InsertedDataEntity } from '../entities/data-insertion/inserted-data.entity';
import { DefinedDataEnum } from '../constants/defined-data.constant';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RedeemGiftCardSubscriber
  implements EntitySubscriberInterface<AttendeesTickets>
{
  constructor(private readonly dataSource: DataSource) {
    this.dataSource.subscribers.push(this);
  }

  listenTo(): Function | string {
    return AttendeesTickets;
  }

  async afterInsert(event: InsertEvent<AttendeesTickets>): Promise<any> {
    const ticket_event = event.entity;

    if (ticket_event.event_type_id == TicketsEventTypes.REDEEM_GIFT_CARD) {
      await event.queryRunner.manager.getRepository(InsertedDataEntity).insert({
        attendee_id: +ticket_event.attendee.id,
        defined_data_id: DefinedDataEnum.REDEEM_GIFT_CARD,
        value: 1,
      });
    }
  }
}
