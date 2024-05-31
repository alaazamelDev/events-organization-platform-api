import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { GamificationConditionsService } from '../services/gamification-conditions.service';
import { AddRuleConditionDto } from '../dto/add-rule-condition.dto';

@Controller('gamification/rules/conditions')
export class GamificationRulesConditionsController {
  constructor(
    private readonly gamificationConditionsService: GamificationConditionsService,
  ) {}

  @Post()
  async addCondition(@Body() addRuleConditionDto: AddRuleConditionDto) {
    return this.gamificationConditionsService.addCondition(addRuleConditionDto);
  }

  @Delete(':id')
  async deleteCondition(@Param('id') condition_id: string) {
    return this.gamificationConditionsService.deleteCondition(+condition_id);
  }
}
