import { Injectable } from '@nestjs/common';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { CreateRuleDto } from '../dto/create-rule.dto';
import { RuleEntity } from '../entities/rules/rule.entity';
import { UpdateRuleDto } from '../dto/update-rule.dto';
import { GamificationConditionsService } from './gamification-conditions.service';
import { GamificationRewardsService } from './gamification-rewards.service';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class GamificationRulesService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(RuleEntity)
    private readonly ruleRepository: Repository<RuleEntity>,
    private readonly gamificationConditionsService: GamificationConditionsService,
    private readonly gamificationRewardsService: GamificationRewardsService,
  ) {}

  async getRules() {
    return this.ruleRepository.find({
      relations: {
        conditions: { operator: true, definedData: true },
        rewards: { type: true },
      },
    });
  }

  async createRule(createRuleDto: CreateRuleDto, queryRunner: QueryRunner) {
    const rule = queryRunner.manager
      .getRepository(RuleEntity)
      .create({ name: createRuleDto.name });

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

    await this.dataSource.manager.save(rule, { reload: true });

    return rule;
  }
}
