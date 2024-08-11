import { Injectable } from '@nestjs/common';
import { QueryRunner } from 'typeorm';
import { RuleEntity } from '../entities/rules/rule.entity';
import { RuleConditionEntity } from '../entities/rules/rule-condition.entity';
import { OperatorService } from '../services/operator.service';
import { OperatorsEnum } from '../constants/operators.constant';
import { GamificationRulesService } from '../services/gamification-rules.service';
import { GamificationRewardedDataService } from '../services/gamification-rewarded-data.service';
import { GamificationInsertedDataService } from '../services/gamification-inserted-data.service';
import { AwardService } from '../services/award.service';
import { RewardedDataEntity } from '../entities/rules/rewarded-data.entity';
import { RewardEntity } from '../entities/rewards/reward.entity';
import { AttendeeAchievedRulesEntity } from '../entities/rules/attendee-achieved-rules.entity';

@Injectable()
export class ExecuteRules {
  constructor(
    private readonly operatorService: OperatorService,
    private readonly awardService: AwardService,
    private readonly gamificationRulesService: GamificationRulesService,
    private readonly gamificationRewardedDataService: GamificationRewardedDataService,
    private readonly gamificationInsertedDataService: GamificationInsertedDataService,
  ) {}

  async executeRules(attendee_id: number, queryRunner: QueryRunner) {
    const rules =
      await this.gamificationRulesService.getEnabledRulesInRespectToAchievedRulesByAttendee(
        attendee_id,
      );

    await Promise.all(
      rules.map(async (rule) => {
        const is_rule_true = await this.getRuleResult(
          rule,
          attendee_id,
          queryRunner,
        );

        if (is_rule_true) {
          const timesAchieved = await this.howManyTimesRuleIsAchieved(
            rule,
            attendee_id,
            queryRunner,
          );

          await this.recordRewardedData(
            rule,
            attendee_id,
            timesAchieved,
            queryRunner,
          );

          await this.awardAttendee(
            rule.rewards,
            attendee_id,
            timesAchieved,
            queryRunner,
          );

          await queryRunner.manager
            .getRepository(AttendeeAchievedRulesEntity)
            .insert({
              rule_id: rule.id,
              attendee_id: attendee_id,
            });
        }
      }),
    );
  }

  private async getRuleResult(
    rule: RuleEntity,
    attendee_id: number,
    queryRunner: QueryRunner,
  ): Promise<boolean> {
    const conditions = rule.conditions;

    const results = await Promise.all(
      conditions.map(async (condition) => {
        return await this.evaluateCondition(
          condition,
          attendee_id,
          queryRunner,
        );
      }),
    );

    return !results.includes(false);
  }

  private async evaluateCondition(
    condition: RuleConditionEntity,
    attendee_id: number,
    queryRunner: QueryRunner,
  ): Promise<boolean> {
    const defined_data_id = condition.defined_data_id;
    const target = condition.value;
    const operator_name = condition.operator.name as OperatorsEnum;
    const rule_id = condition.rule_id;
    const time = condition.time;

    const data = await this.gamificationInsertedDataService.getInsertedData(
      attendee_id,
      defined_data_id,
      time,
      queryRunner,
    );

    const rewarded_value =
      await this.gamificationRewardedDataService.getRuleRewardedValue(
        rule_id,
        defined_data_id,
        attendee_id,
        queryRunner,
      );

    return this.operatorService
      .getStrategy(operator_name)
      .evaluate(data, target, rewarded_value);
  }

  private async howManyTimesRuleIsAchieved(
    rule: RuleEntity,
    attendee_id: number,
    queryRunner: QueryRunner,
  ) {
    return await Promise.all(
      rule.conditions
        .filter((condition) => condition.operator.name === OperatorsEnum.Equal)
        .map(async (condition) => {
          const achieved = await this.gamificationInsertedDataService
            .getInsertedData(
              attendee_id,
              condition.defined_data_id,
              condition.time,
              queryRunner,
            )
            .then((result) => result.reduce((acc, obj) => acc + obj.value, 0));

          const rewarded =
            await this.gamificationRewardedDataService.getRuleRewardedValue(
              rule.id,
              condition.defined_data_id,
              attendee_id,
              queryRunner,
            );

          const actual_value = achieved - rewarded;

          return Math.floor(actual_value / condition.value);
        }),
    ).then((result) =>
      result.reduce((acc, x) => Math.min(acc, x), Number.MAX_SAFE_INTEGER),
    );
  }

  private async awardAttendee(
    rewards: RewardEntity[],
    attendee_id: number,
    min_value: number,
    queryRunner: QueryRunner,
  ) {
    return await Promise.all(
      rewards.map(async (reward) => {
        const rewarded = await this.awardService
          .getStrategy(reward.type_id)
          .award(reward, attendee_id, min_value);

        await queryRunner.manager.save(rewarded);

        return rewarded;
      }),
    );
  }

  private async recordRewardedData(
    rule: RuleEntity,
    attendee_id: number,
    min_value: number,
    queryRunner: QueryRunner,
  ) {
    return await Promise.all(
      rule.conditions
        .filter((condition) => condition.operator.name === OperatorsEnum.Equal)
        .map(async (cond) => {
          const rewarded_data = queryRunner.manager
            .getRepository(RewardedDataEntity)
            .create({
              rule_id: rule.id,
              defined_data_id: cond.defined_data_id,
              attendee_id: attendee_id,
              value: cond.value * min_value,
            });

          await queryRunner.manager.save(rewarded_data);

          return rewarded_data;
        }),
    );
  }
}
