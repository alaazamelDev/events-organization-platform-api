import { PrizeEntity } from '../../entities/prizes/prize.entity';
import { AttendeesTickets } from '../../../payment/entities/attendees-tickets.entity';
import { AttendeeRedeemablePointsEntity } from '../../entities/rewards-attendee/attendee-redeemable-points.entity';

export type RedeemTicketsPrizeType = {
  attendeeTickets: AttendeesTickets;
  attendeeRP: AttendeeRedeemablePointsEntity;
  [key: string]: any;
};

export interface RedeemStrategy {
  redeem(
    prize: PrizeEntity,
    attendee_id: number,
  ): Promise<RedeemTicketsPrizeType>;
}
