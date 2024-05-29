import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { GamificationRewardsService } from '../services/gamification-rewards.service';
import { CreatePointsRewardDto } from '../dto/create-points-reward.dto';
import { TransactionInterceptor } from '../../../common/interceptors/transaction/transaction.interceptor';
import { QueryRunnerParam } from '../../../common/decorators/query-runner-param.decorator';
import { QueryRunner } from 'typeorm';
import { CreateBadgeRewardDto } from '../dto/create-badge-reward.dto';

@Controller('gamification/rewards')
export class GamificationRewardsController {
  constructor(
    private readonly gamificationRewardsService: GamificationRewardsService,
  ) {}

  @Post('points')
  @UseInterceptors(TransactionInterceptor)
  async createPoints(
    @Body() createPointsRewardDto: CreatePointsRewardDto,
    @QueryRunnerParam() queryRunner: QueryRunner,
  ) {
    return this.gamificationRewardsService.createPoints(
      createPointsRewardDto,
      queryRunner,
    );
  }

  @Post('badges')
  @UseInterceptors(TransactionInterceptor)
  async createBadge(
    @Body() createBadgeRewardDto: CreateBadgeRewardDto,
    @QueryRunnerParam() queryRunner: QueryRunner,
  ) {
    return this.gamificationRewardsService.createBadge(
      createBadgeRewardDto,
      queryRunner,
    );
  }
}
