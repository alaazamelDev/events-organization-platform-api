import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { GamificationRulesService } from '../services/gamification-rules.service';
import { CreateRuleDto } from '../dto/create-rule.dto';
import { TransactionInterceptor } from '../../../common/interceptors/transaction/transaction.interceptor';
import { QueryRunnerParam } from '../../../common/decorators/query-runner-param.decorator';
import { QueryRunner } from 'typeorm';

@Controller('gamification/rules')
export class GamificationRulesController {
  constructor(
    private readonly gamificationRulesService: GamificationRulesService,
  ) {}

  @Post()
  @UseInterceptors(TransactionInterceptor)
  createRule(
    @Body() createRuleDto: CreateRuleDto,
    @QueryRunnerParam() queryRunner: QueryRunner,
  ) {
    return this.gamificationRulesService.createRule(createRuleDto, queryRunner);
  }
}
