import { Injectable } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';
import { CreateRuleDto } from '../dto/create-rule.dto';
import { RuleEntity } from '../entities/rules/rule.entity';
import { AssignRewardToRuleDto } from '../dto/assign-reward-to-rule.dto';
import { RewardEntity } from '../entities/rewards/reward.entity';
import { CreateRuleConditionDto } from '../dto/create-rule-condition.dto';
import { RuleConditionEntity } from '../entities/rules/rule-condition.entity';

@Injectable()
export class GamificationRulesService {
  constructor(private readonly dataSource: DataSource) {}

  async createRule(createRuleDto: CreateRuleDto, queryRunner: QueryRunner) {
    const rule = queryRunner.manager
      .getRepository(RuleEntity)
      .create({ name: createRuleDto.name });

    await queryRunner.manager.save(rule, { reload: true });

    await Promise.all(
      createRuleDto.rewards.map(async (reward) =>
        this.assignRewardsToRule(rule.id, reward, queryRunner),
      ),
    );

    await Promise.all(
      createRuleDto.conditions.map(
        async (condition) =>
          await this.createCondition(rule.id, condition, queryRunner),
      ),
    );

    return rule;
  }

  private async assignRewardsToRule(
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

  private async createCondition(
    rule_id: number,
    createRuleConditionDto: CreateRuleConditionDto,
    queryRunner: QueryRunner,
  ) {
    const condition = queryRunner.manager
      .getRepository(RuleConditionEntity)
      .create({
        rule: { id: rule_id } as RuleEntity,
        value: createRuleConditionDto.value,
        time: new Date(createRuleConditionDto.time),
      });

    await queryRunner.manager.save(condition);
  }
}
