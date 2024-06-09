import { AwardStrategy } from './award.strategy.interface';
import { RewardEntity } from '../../entities/rewards/reward.entity';
import { AttendeeRedeemablePointsEntity } from '../../entities/rewards-attendee/attendee-redeemable-points.entity';
import { DataSource } from 'typeorm';
import { Attendee } from '../../../attendee/entities/attendee.entity';
import { RedeemablePointsEntity } from '../../entities/rewards/redeemable-points.entity';

export class AwardRedeemablePointsStrategy implements AwardStrategy {
  constructor(private readonly dataSource: DataSource) {}

  async award(
    reward: RewardEntity,
    attendee_id: number,
    times: number,
  ): Promise<AttendeeRedeemablePointsEntity> {
    const redeemable_points = await this.dataSource
      .getRepository(RedeemablePointsEntity)
      .createQueryBuilder('points')
      .where('points.reward = :rewardID', { rewardID: reward.id })
      .getOneOrFail();

    return this.dataSource
      .getRepository(AttendeeRedeemablePointsEntity)
      .create({
        attendee: { id: attendee_id } as Attendee,
        value: redeemable_points.value * times,
        metaData: {},
      });
  }
}
