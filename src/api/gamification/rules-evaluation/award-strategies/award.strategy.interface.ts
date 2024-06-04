import { RewardEntity } from '../../entities/rewards/reward.entity';
import { AttendeePointsEntity } from '../../entities/rewards-attendee/attendee-points.entity';
import { AttendeeBadgeEntity } from '../../entities/rewards-attendee/attendee-badge.entity';

export interface AwardStrategy {
  award(
    reward: RewardEntity,
    attendee_id: number,
    times: number,
  ): Promise<AttendeePointsEntity | AttendeeBadgeEntity[]>;
}
