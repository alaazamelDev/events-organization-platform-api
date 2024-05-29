import { Injectable } from '@nestjs/common';
import { CreatePointsRewardDto } from '../dto/create-points-reward.dto';
import { DataSource, QueryRunner } from 'typeorm';
import { PointsEntity } from '../entities/rewards/points.entity';
import { CreateBadgeRewardDto } from '../dto/create-badge-reward.dto';
import { RewardEntity } from '../entities/rewards/reward.entity';
import { RewardTypesEnum } from '../constants/reward-types.constant';
import { BadgeEntity } from '../entities/rewards/badge.entity';

@Injectable()
export class GamificationRewardsService {
  constructor(private readonly dataSource: DataSource) {}

  async createPoints(
    createPointsRewardDto: CreatePointsRewardDto,
    queryRunner: QueryRunner,
  ) {
    const reward = this.createReward(
      createPointsRewardDto.name,
      RewardTypesEnum.POINTS,
    );

    await queryRunner.manager.save(reward, { reload: true });

    const points = queryRunner.manager.getRepository(PointsEntity).create({
      reward: { id: reward.id } as RewardEntity,
      value: createPointsRewardDto.value,
    });

    await queryRunner.manager.save(points);

    return points;
  }

  async createBadge(
    createBadgeRewardDto: CreateBadgeRewardDto,
    queryRunner: QueryRunner,
  ) {
    const reward = this.createReward(
      createBadgeRewardDto.name,
      RewardTypesEnum.BADGE,
    );

    await queryRunner.manager.save(reward, { reload: true });

    const badge = queryRunner.manager.getRepository(BadgeEntity).create({
      reward: { id: reward.id } as RewardEntity,
      shape: JSON.parse(<string>createBadgeRewardDto.shape),
    });

    await queryRunner.manager.save(badge, { reload: true });

    return badge;
  }

  private createReward(name: string, type: RewardTypesEnum) {
    return this.dataSource.getRepository(RewardEntity).create({
      name: name,
      type_id: type,
    });
  }
}
