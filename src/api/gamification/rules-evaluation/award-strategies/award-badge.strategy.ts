import { AwardStrategy } from './award.strategy.interface';
import { RewardEntity } from '../../entities/rewards/reward.entity';
import { BadgeEntity } from '../../entities/rewards/badge.entity';
import { DataSource } from 'typeorm';
import { AttendeeBadgeEntity } from '../../entities/rewards-attendee/attendee-badge.entity';
import { Attendee } from '../../../attendee/entities/attendee.entity';

export class AwardBadgeStrategy implements AwardStrategy {
  constructor(private readonly dataSource: DataSource) {}

  async award(
    reward: RewardEntity,
    attendee_id: number,
  ): Promise<AttendeeBadgeEntity> {
    const badge = await this.dataSource
      .getRepository(BadgeEntity)
      .createQueryBuilder('badge')
      .where('badge.reward = :rewardID', { rewardID: reward.id })
      .getOneOrFail();

    return this.dataSource.getRepository(AttendeeBadgeEntity).create({
      attendee: { id: attendee_id } as Attendee,
      badge: { id: badge.id },
    });
  }
}
