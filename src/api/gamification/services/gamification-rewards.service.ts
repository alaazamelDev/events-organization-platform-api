import { Injectable } from '@nestjs/common';
import { CreatePointsRewardDto } from '../dto/create-points-reward.dto';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { PointsEntity } from '../entities/rewards/points.entity';
import { CreateBadgeRewardDto } from '../dto/create-badge-reward.dto';
import { RewardEntity } from '../entities/rewards/reward.entity';
import { RewardTypesEnum } from '../constants/reward-types.constant';
import { BadgeEntity } from '../entities/rewards/badge.entity';
import { AssignRewardToRuleDto } from '../dto/assign-reward-to-rule.dto';
import { RuleEntity } from '../entities/rules/rule.entity';
import { UpdatePointsRewardDto } from '../dto/update-points-reward.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateBadgeRewardDto } from '../dto/update-badge-reward.dto';

@Injectable()
export class GamificationRewardsService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(PointsEntity)
    private readonly pointsRepository: Repository<PointsEntity>,
    @InjectRepository(RewardEntity)
    private readonly rewardRepository: Repository<RewardEntity>,
    @InjectRepository(BadgeEntity)
    private readonly badgeRepository: Repository<BadgeEntity>,
  ) {}

  async getBadges() {
    return this.badgeRepository.find({
      relations: {
        reward: { rule: { conditions: { operator: true, definedData: true } } },
      },
    });
  }

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
      visibility: createBadgeRewardDto.visibility,
      anonymous: createBadgeRewardDto.anonymous,
    });

    await queryRunner.manager.save(badge, { reload: true });

    return badge;
  }

  async updatePointsReward(
    updatePointsRewardDto: UpdatePointsRewardDto,
    queryRunner: QueryRunner,
  ) {
    const points_reward = await this.pointsRepository.findOneOrFail({
      where: { id: updatePointsRewardDto.reward_points_id },
      relations: { reward: true },
    });

    const reward = await this.rewardRepository.findOneOrFail({
      where: { id: points_reward.reward_id },
    });

    await this.updateRewardName(updatePointsRewardDto, reward, queryRunner);
    await this.updatePointsValue(
      updatePointsRewardDto,
      points_reward,
      queryRunner,
    );

    return points_reward;
  }

  async updateBadge(
    updateBadgeRewardDto: UpdateBadgeRewardDto,
    queryRunner: QueryRunner,
  ) {
    const badge = await this.badgeRepository.findOneOrFail({
      where: { id: updateBadgeRewardDto.badge_id },
      relations: { reward: true },
    });

    const reward = await this.rewardRepository.findOneOrFail({
      where: { id: badge.reward_id },
    });

    await this.updateRewardName(updateBadgeRewardDto, reward, queryRunner);
    await this.updateBadgeShape(updateBadgeRewardDto, badge, queryRunner);

    return badge;
  }

  private async updateRewardName(
    dto: UpdatePointsRewardDto | UpdateBadgeRewardDto,
    reward: RewardEntity,
    queryRunner: QueryRunner,
  ) {
    if (dto.name) {
      reward.name = dto.name;

      await queryRunner.manager.save(reward);
    }

    return reward;
  }

  private async updatePointsValue(
    dto: UpdatePointsRewardDto,
    points: PointsEntity,
    queryRunner: QueryRunner,
  ) {
    if (dto.value) {
      points.value = dto.value;

      await queryRunner.manager.save(points);
    }

    return points;
  }

  private async updateBadgeShape(
    dto: UpdateBadgeRewardDto,
    badge: BadgeEntity,
    queryRunner: QueryRunner,
  ) {
    for (const [key, value] of Object.entries(dto)) {
      if (value !== undefined) {
        badge[key] = value;
      }
    }

    // if (dto.anonymous !== undefined) {
    //   badge.anonymous = dto.anonymous;
    // }
    //
    // if (dto.visibility !== undefined) {
    //   badge.visibility = dto.visibility;
    // }
    // if (dto.shape) {
    //   badge.shape = dto.shape;
    // }
    await queryRunner.manager.save(badge);

    return badge;
  }

  async assignRewardToRule(
    rule_id: number,
    reward: AssignRewardToRuleDto,
    queryRunner: QueryRunner,
  ) {
    await queryRunner.manager
      .createQueryBuilder()
      .update(RewardEntity)
      .set({ rule: { id: rule_id } as RuleEntity })
      .where('id = :id', { id: reward.reward_id })
      .execute();
  }

  private createReward(name: string, type: RewardTypesEnum) {
    return this.dataSource.getRepository(RewardEntity).create({
      name: name,
      type_id: type,
    });
  }
}
