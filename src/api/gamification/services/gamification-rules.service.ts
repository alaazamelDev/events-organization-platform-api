import { Injectable } from '@nestjs/common';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { CreateRuleDto } from '../dto/rules/create-rule.dto';
import { RuleEntity } from '../entities/rules/rule.entity';
import { UpdateRuleDto } from '../dto/rules/update-rule.dto';
import { GamificationConditionsService } from './gamification-conditions.service';
import { GamificationRewardsService } from './gamification-rewards.service';
import { InjectRepository } from '@nestjs/typeorm';
import { AssignRewardToRuleDto } from '../dto/rewards/assign-reward-to-rule.dto';
import { RewardEntity } from '../entities/rewards/reward.entity';
import { UnAssignRewardToRuleDto } from '../dto/rewards/un-assign-reward-to-rule.dto';
import { GetRulesSerializer } from '../serializers/get-rules.serializer';
import { AttendeeAchievedRulesEntity } from '../entities/rules/attendee-achieved-rules.entity';

@Injectable()
export class GamificationRulesService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(RuleEntity)
    private readonly ruleRepository: Repository<RuleEntity>,
    @InjectRepository(RewardEntity)
    private readonly rewardRepository: Repository<RewardEntity>,
    @InjectRepository(AttendeeAchievedRulesEntity)
    private readonly attendeeAchievedRulesRepository: Repository<AttendeeAchievedRulesEntity>,
    private readonly gamificationConditionsService: GamificationConditionsService,
    private readonly gamificationRewardsService: GamificationRewardsService,
  ) {}

  async getRules() {
    const result = await this.ruleRepository.find({
      relations: {
        conditions: { operator: true, definedData: true },
        rewards: { type: true },
      },
    });

    return result.map((rule) => {
      return {
        ...rule,
        rewards: GetRulesSerializer.serializeList(rule.rewards),
      };
    });
  }

  async createRule(createRuleDto: CreateRuleDto, queryRunner: QueryRunner) {
    const rule = queryRunner.manager
      .getRepository(RuleEntity)
      .create({ name: createRuleDto.name, recurring: createRuleDto.recurring });

    await queryRunner.manager.save(rule, { reload: true });

    await Promise.all(
      createRuleDto.rewards.map(async (reward) =>
        this.gamificationRewardsService.assignRewardToRule(
          rule.id,
          reward,
          queryRunner,
        ),
      ),
    );

    await Promise.all(
      createRuleDto.conditions.map(
        async (condition) =>
          await this.gamificationConditionsService.createCondition(
            rule.id,
            condition,
            queryRunner,
          ),
      ),
    );

    return rule;
  }

  async updateRule(updateRuleDto: UpdateRuleDto) {
    const rule = await this.dataSource
      .getRepository(RuleEntity)
      .createQueryBuilder('rule')
      .where('rule.id = :id', { id: updateRuleDto.rule_id })
      .getOneOrFail();

    if (updateRuleDto.name) {
      rule.name = updateRuleDto.name;
    }

    if (updateRuleDto.enabled !== undefined) {
      rule.enabled = updateRuleDto.enabled;
    }

    if (updateRuleDto.recurring !== undefined) {
      rule.recurring = updateRuleDto.recurring;
    }

    await this.dataSource.manager.save(rule, { reload: true });

    return rule;
  }

  async assignRewardToRule(
    ruleID: number,
    assignRewardToRuleDto: AssignRewardToRuleDto,
  ) {
    const reward = await this.rewardRepository.findOneOrFail({
      where: { id: assignRewardToRuleDto.reward_id },
    });

    reward.rule = { id: ruleID } as RuleEntity;

    await this.rewardRepository.save(reward, { reload: true });

    return reward;
  }

  async unAssignRewardToRule(unAssignRewardToRuleDto: UnAssignRewardToRuleDto) {
    const reward = await this.rewardRepository.findOneOrFail({
      where: { id: unAssignRewardToRuleDto.reward_id },
    });

    reward.rule = null;

    await this.rewardRepository.save(reward, { reload: true });

    return reward;
  }

  async getEnabledRulesInRespectToAchievedRulesByAttendee(attendeeID: number) {
    const rules = await this.dataSource.getRepository(RuleEntity).find({
      where: { enabled: true },
      relations: {
        conditions: { operator: true, definedData: true },
        rewards: true,
      },
    });

    const attendeeAchievedRules =
      await this.attendeeAchievedRulesRepository.find({
        where: {
          attendee_id: attendeeID,
        },
      });

    return rules.filter(
      (rule) =>
        rule.recurring ||
        (!rule.recurring &&
          !attendeeAchievedRules.some((obj) => +obj.rule_id === +rule.id)),
    );
  }
}
