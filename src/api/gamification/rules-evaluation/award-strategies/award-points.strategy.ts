import { AwardStrategy } from './award.strategy.interface';
import { RewardEntity } from '../../entities/rewards/reward.entity';
import { PointsEntity } from '../../entities/rewards/points.entity';
import { DataSource } from 'typeorm';
import { AttendeePointsEntity } from '../../entities/rewards-attendee/attendee-points.entity';
import { Attendee } from '../../../attendee/entities/attendee.entity';

export class AwardPointsStrategy implements AwardStrategy {
  constructor(private readonly dataSource: DataSource) {}

  async award(
    reward: RewardEntity,
    attendee_id: number,
    times: number,
  ): Promise<AttendeePointsEntity> {
    const points = await this.dataSource
      .getRepository(PointsEntity)
      .createQueryBuilder('points')
      .where('points.reward = :rewardID', { rewardID: reward.id })
      .getOneOrFail();

    return this.dataSource.getRepository(AttendeePointsEntity).create({
      attendee: { id: attendee_id } as Attendee,
      value: points.value * times,
      metaData: {},
    });
  }
}
