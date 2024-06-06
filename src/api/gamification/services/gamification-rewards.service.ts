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
import { CreateRedeemablePointsRewardDto } from '../dto/create-redeemable-points-reward.dto';
import { RedeemablePointsEntity } from '../entities/rewards/redeemable-points.entity';
import { UpdateRedeemablePointsRewardDto } from '../dto/update-redeemable-points-reward.dto';

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
    @InjectRepository(RedeemablePointsEntity)
    private readonly redeemablePointsRepository: Repository<RedeemablePointsEntity>,
  ) {}

  async getBadges() {
    return this.badgeRepository.find({
      relations: {
        reward: { rule: { conditions: { operator: true, definedData: true } } },
      },
    });
  }

  async getPointsRewards() {
    return this.pointsRepository.find({
      relations: {
        reward: { rule: { conditions: { operator: true, definedData: true } } },
      },
    });
  }

  async getRedeemablePointsRewards() {
    return this.redeemablePointsRepository.find({
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

    points.reward = reward;

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
    badge.reward = reward;

    return badge;
  }

  async createRedeemablePoints(
    createRedeemablePointsRewardDto: CreateRedeemablePointsRewardDto,
    queryRunner: QueryRunner,
  ) {
    const reward = this.createReward(
      createRedeemablePointsRewardDto.name,
      RewardTypesEnum.REDEEMABLE_POINTS,
    );

    await queryRunner.manager.save(reward, { reload: true });

    const redeemable_points = queryRunner.manager
      .getRepository(RedeemablePointsEntity)
      .create({
        reward: { id: reward.id } as RewardEntity,
        value: createRedeemablePointsRewardDto.value,
      });

    await queryRunner.manager.save(redeemable_points);

    redeemable_points.reward = reward;

    return redeemable_points;
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

    const updated_reward = await this.updateRewardName(
      updatePointsRewardDto,
      reward,
      queryRunner,
    );
    await this.updatePointsValue(
      updatePointsRewardDto,
      points_reward,
      queryRunner,
    );

    points_reward.reward = updated_reward;

    return points_reward;
  }

  async updateRedeemablePointsReward(
    updateRedeemablePointsRewardDto: UpdateRedeemablePointsRewardDto,
    queryRunner: QueryRunner,
  ) {
    const redeemable_points_reward =
      await this.redeemablePointsRepository.findOneOrFail({
        where: {
          id: updateRedeemablePointsRewardDto.reward_redeemable_points_id,
        },
        relations: { reward: true },
      });

    const reward = await this.rewardRepository.findOneOrFail({
      where: { id: redeemable_points_reward.reward_id },
    });

    const updated_reward = await this.updateRewardName(
      updateRedeemablePointsRewardDto,
      reward,
      queryRunner,
    );
    await this.updateRedeemablePointsValue(
      updateRedeemablePointsRewardDto,
      redeemable_points_reward,
      queryRunner,
    );

    redeemable_points_reward.reward = updated_reward;

    return redeemable_points_reward;
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

    const update_reward = await this.updateRewardName(
      updateBadgeRewardDto,
      reward,
      queryRunner,
    );
    await this.updateBadgeShape(updateBadgeRewardDto, badge, queryRunner);

    badge.reward = update_reward;

    return badge;
  }

  private async updateRewardName(
    dto:
      | UpdatePointsRewardDto
      | UpdateBadgeRewardDto
      | UpdateRedeemablePointsRewardDto,
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

  private async updateRedeemablePointsValue(
    dto: UpdateRedeemablePointsRewardDto,
    points: RedeemablePointsEntity,
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
