import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { RuleEntity } from '../entities/rules/rule.entity';
import { RuleConditionEntity } from '../entities/rules/rule-condition.entity';
import { OperatorService } from './operator.service';
import { OperatorsEnum } from '../constants/operators.constant';
import { GamificationRulesService } from '../services/gamification-rules.service';
import { GamificationRewardedDataService } from '../services/gamification-rewarded-data.service';
import { GamificationInsertedDataService } from '../services/gamification-inserted-data.service';
import { AwardService } from './award.service';
import { RewardedDataEntity } from '../entities/rules/rewarded-data.entity';

@Injectable()
export class ExecuteRules {
  constructor(
    private readonly dataSource: DataSource,
    private readonly operatorService: OperatorService,
    private readonly awardService: AwardService,
    private readonly gamificationRulesService: GamificationRulesService,
    private readonly gamificationRewardedDataService: GamificationRewardedDataService,
    private readonly gamificationInsertedDataService: GamificationInsertedDataService,
  ) {}

  async executeRules(attendee_id: number) {
    const rules = await this.gamificationRulesService.getEnabledRules();
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      await Promise.all(
        rules.map(async (rule) => {
          const is_rule_true = await this.getRuleResult(rule, attendee_id);

          console.log('rule result', is_rule_true);
          // if rule is ok, then give the rewards to the attendee

          // insert new record inside rewarded data table
          if (is_rule_true) {
            const max_value_condition = rule.conditions.reduce((res, obj) =>
              obj.value > res.value ? obj : res,
            );

            const data = await this.gamificationInsertedDataService
              .getInsertedData(
                attendee_id,
                max_value_condition.defined_data_id,
                max_value_condition.time,
              )
              .then((res) => res.reduce((acc, obj) => acc + obj.value, 0));

            const to_gain = Math.floor(data / max_value_condition.value);
            const reminder = Math.floor(data % max_value_condition.value);

            console.log(to_gain);
            console.log(reminder);

            // await Promise.all(
            //   rule.rewards.map(async (reward) => {
            //     const rewarded = await this.awardService
            //       .getStrategy(reward.type_id)
            //       .award(reward, attendee_id);
            //
            //     await queryRunner.manager.save(rewarded);
            //   }),
            // );

            // await Promise.all(
            //   rule.conditions.map(async (cond) => {
            //     if (cond.operator.name === OperatorsEnum.Equal) {
            //       // TODO, work on value
            //       const rewarded_data = this.dataSource
            //         .getRepository(RewardedDataEntity)
            //         .create({
            //           rule_id: rule.id,
            //           defined_data_id: cond.defined_data_id,
            //           attendee_id: attendee_id,
            //           value: cond.value,
            //         });
            //
            //       await queryRunner.manager.save(rewarded_data);
            //     }
            //   }),
            // );
          }
        }),
      );

      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async getRuleResult(rule: RuleEntity, attendee_id: number): Promise<boolean> {
    const conditions = rule.conditions;

    const results = await Promise.all(
      conditions.map(async (condition) => {
        return await this.evaluateCondition(condition, attendee_id);
      }),
    );

    return !results.includes(false);
  }

  async evaluateCondition(
    condition: RuleConditionEntity,
    attendee_id: number,
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
    );

    const rewarded_value =
      await this.gamificationRewardedDataService.getRuleRewardedValue(
        rule_id,
        defined_data_id,
        attendee_id,
      );

    return this.operatorService
      .getStrategy(operator_name)
      .evaluate(data, target, rewarded_value);
  }
}
