import {
  Body,
  Controller,
  Get,
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
}
