import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { GamificationRulesService } from '../services/gamification-rules.service';
import { CreateRuleDto } from '../dto/create-rule.dto';
import { TransactionInterceptor } from '../../../common/interceptors/transaction/transaction.interceptor';
import { QueryRunnerParam } from '../../../common/decorators/query-runner-param.decorator';
import { QueryRunner } from 'typeorm';
import { UpdateRuleDto } from '../dto/update-rule.dto';
import { AssignRewardToRuleDto } from '../dto/assign-reward-to-rule.dto';
import { UnAssignRewardToRuleDto } from '../dto/un-assign-reward-to-rule.dto';

@Controller('gamification/rules')
export class GamificationRulesController {
  constructor(
    private readonly gamificationRulesService: GamificationRulesService,
  ) {}

  @Get()
  getRules() {
    return this.gamificationRulesService.getRules();
  }

  @Post()
  @UseInterceptors(TransactionInterceptor)
  createRule(
    @Body() createRuleDto: CreateRuleDto,
    @QueryRunnerParam() queryRunner: QueryRunner,
  ) {
    return this.gamificationRulesService.createRule(createRuleDto, queryRunner);
  }

  @Put()
  updateRule(@Body() updateRuleDto: UpdateRuleDto) {
    return this.gamificationRulesService.updateRule(updateRuleDto);
  }

  @Post('un-assign-reward')
  async unAssignRewardToRule(
    @Body() unAssignRewardToRuleDto: UnAssignRewardToRuleDto,
  ) {
    return this.gamificationRulesService.unAssignRewardToRule(
      unAssignRewardToRuleDto,
    );
  }

  @Post(':id/assign-reward')
  async assignRewardToRule(
    @Param('id') ruleID: string,
    @Body() assignRewardToRuleDto: AssignRewardToRuleDto,
  ) {
    return this.gamificationRulesService.assignRewardToRule(
      +ruleID,
      assignRewardToRuleDto,
    );
  }
}
