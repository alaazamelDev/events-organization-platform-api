import {
  RedeemStrategy,
  RedeemTicketsPrizeType,
} from './redeem.strategy.interface';
import { PrizeEntity } from '../../entities/prizes/prize.entity';
import { DataSource } from 'typeorm';
import { TicketPrizeEntity } from '../../entities/prizes/ticket-prize.entity';
import { AttendeesTickets } from '../../../payment/entities/attendees-tickets.entity';
import { Attendee } from '../../../attendee/entities/attendee.entity';
import { TicketsEventTypes } from '../../../payment/constants/tickets-event-types.constant';
import { AttendeeRedeemablePointsEntity } from '../../entities/rewards-attendee/attendee-redeemable-points.entity';

export class RedeemTicketsPrizeStrategy implements RedeemStrategy {
  constructor(private readonly dataSource: DataSource) {}

  async redeem(
    prize: PrizeEntity,
    attendee_id: number,
  ): Promise<RedeemTicketsPrizeType> {
    const ticketsPrize = await this.dataSource
      .getRepository(TicketPrizeEntity)
      .createQueryBuilder('ticket')
      .where('ticket.prize_id = :prizeID', { prizeID: prize.id })
      .getOneOrFail();

    const attendeeTickets = this.dataSource
      .getRepository(AttendeesTickets)
      .create({
        attendee: { id: attendee_id } as Attendee,
        value: ticketsPrize.tickets_value,
        event_type_id: TicketsEventTypes.REDEEM_POINTS,
        data: { prize_id: prize.id, rp: prize.rp_value },
      });

    const redeemedRP = this.dataSource
      .getRepository(AttendeeRedeemablePointsEntity)
      .create({
        attendee: { id: attendee_id } as Attendee,
        value: prize.rp_value * -1,
        metaData: {},
      });

    return { attendeeTickets: attendeeTickets, attendeeRP: redeemedRP };
  }
}
