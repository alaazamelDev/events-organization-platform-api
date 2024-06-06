import { Injectable } from '@nestjs/common';
import { CreateRuleConditionDto } from '../dto/create-rule-condition.dto';
import { DataSource, QueryRunner } from 'typeorm';
import { RuleConditionEntity } from '../entities/rules/rule-condition.entity';
import { OperatorEntity } from '../entities/data-definition/operator.entity';
import { DefinedDataEntity } from '../entities/data-definition/defined-data.entity';
import { RuleEntity } from '../entities/rules/rule.entity';
import { AddRuleConditionDto } from '../dto/add-rule-condition.dto';

@Injectable()
export class GamificationConditionsService {
  constructor(private readonly dataSource: DataSource) {}

  async createCondition(
    rule_id: number,
    createRuleConditionDto: CreateRuleConditionDto,
    queryRunner: QueryRunner,
  ) {
    const condition = queryRunner.manager
      .getRepository(RuleConditionEntity)
      .create({
        operator: { id: createRuleConditionDto.operator_id } as OperatorEntity,
        definedData: {
          id: createRuleConditionDto.defined_data_id,
        } as DefinedDataEntity,
        rule: { id: rule_id } as RuleEntity,
        value: createRuleConditionDto.value,
        time: createRuleConditionDto.time
          ? new Date(createRuleConditionDto.time)
          : null,
      });

    await queryRunner.manager.save(condition);
  }

  async addCondition(addRuleConditionDto: AddRuleConditionDto) {
    const condition = this.dataSource.manager
      .getRepository(RuleConditionEntity)
      .create({
        operator: { id: addRuleConditionDto.operator_id } as OperatorEntity,
        definedData: {
          id: addRuleConditionDto.defined_data_id,
        } as DefinedDataEntity,
        rule: { id: addRuleConditionDto.rule_id } as RuleEntity,
        value: addRuleConditionDto.value,
        time: addRuleConditionDto.time
          ? new Date(addRuleConditionDto.time)
          : null,
      });

    await this.dataSource.manager.save(condition);

    return condition;
  }

  async deleteCondition(condition_id: number) {
    await this.dataSource
      .createQueryBuilder()
      .delete()
      .from(RuleConditionEntity)
      .where('id = :id', { id: condition_id })
      .execute();
  }
}
