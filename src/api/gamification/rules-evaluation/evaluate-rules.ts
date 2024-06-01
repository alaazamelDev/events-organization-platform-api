import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { RuleEntity } from '../entities/rules/rule.entity';
import { RuleConditionEntity } from '../entities/rules/rule-condition.entity';
import { InsertedDataEntity } from '../entities/data-insertion/inserted-data.entity';
import { OperatorService } from './operator.service';
import { OperatorsEnum } from '../constants/operators.constant';
import { RewardedDataEntity } from '../entities/rules/rewarded-data.entity';

@Injectable()
export class EvaluateRules {
  constructor(
    private readonly dataSource: DataSource,
    private readonly operatorService: OperatorService,
  ) {}

  async evaluateRules(attendee_id: number) {
    const rules = await this.dataSource.getRepository(RuleEntity).find({
      where: { enabled: true },
      relations: {
        conditions: { operator: true, definedData: true },
        rewards: true,
      },
    });

    await Promise.all(
      rules.map(async (rule) => {
        const is_rule_true = await this.getRuleResult(rule, attendee_id);
      }),
    );
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

    const data = await this.dataSource
      .getRepository(InsertedDataEntity)
      .createQueryBuilder('data')
      .where('data.attendee = :attendeeID', { attendeeID: attendee_id })
      .andWhere('data.definedData = :definedDataID', {
        definedDataID: defined_data_id,
      })
      .getMany();

    const value_rewarded = await this.dataSource
      .getRepository(RewardedDataEntity)
      .createQueryBuilder('data')
      .where('data.attendee = :attendeeID', { attendeeID: attendee_id })
      .andWhere('data.definedData = :definedDataID', {
        definedDataID: defined_data_id,
      })
      .andWhere('data.rule = :ruleID', { ruleID: rule_id })
      .getMany()
      .then((result) => result.reduce((acc, obj) => acc + obj.value, 0));

    return this.operatorService
      .getStrategy(operator_name)
      .evaluate(data, target, value_rewarded);
  }
}
