import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { GamificationRewardsService } from '../services/gamification-rewards.service';
import { CreatePointsRewardDto } from '../dto/create-points-reward.dto';
import { TransactionInterceptor } from '../../../common/interceptors/transaction/transaction.interceptor';
import { QueryRunnerParam } from '../../../common/decorators/query-runner-param.decorator';
import { QueryRunner } from 'typeorm';
import { CreateBadgeRewardDto } from '../dto/create-badge-reward.dto';
import { UpdatePointsRewardDto } from '../dto/update-points-reward.dto';
import { UpdateBadgeRewardDto } from '../dto/update-badge-reward.dto';

@Controller('gamification/rewards')
export class GamificationRewardsController {
  constructor(
    private readonly gamificationRewardsService: GamificationRewardsService,
  ) {}

  @Get('badges')
  async getBadges() {
    return this.gamificationRewardsService.getBadges();
  }

  @Get('points')
  async getPointsRewards() {
    return this.gamificationRewardsService.getPointsRewards();
  }

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

  @Put('points')
  @UseInterceptors(TransactionInterceptor)
  async updatePointsReward(
    @Body() updatePointsRewardDto: UpdatePointsRewardDto,
    @QueryRunnerParam() queryRunner: QueryRunner,
  ) {
    return this.gamificationRewardsService.updatePointsReward(
      updatePointsRewardDto,
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

  @Put('badges')
  @UseInterceptors(TransactionInterceptor)
  async updateBadge(
    @Body() updateBadgeRewardDto: UpdateBadgeRewardDto,
    @QueryRunnerParam() queryRunner: QueryRunner,
  ) {
    return this.gamificationRewardsService.updateBadge(
      updateBadgeRewardDto,
      queryRunner,
    );
  }
}
