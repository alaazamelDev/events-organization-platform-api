import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { GamificationRewardsService } from '../services/gamification-rewards.service';
import { CreatePointsRewardDto } from '../dto/rewards/create-points-reward.dto';
import { TransactionInterceptor } from '../../../common/interceptors/transaction/transaction.interceptor';
import { QueryRunnerParam } from '../../../common/decorators/query-runner-param.decorator';
import { QueryRunner } from 'typeorm';
import { CreateBadgeRewardDto } from '../dto/rewards/create-badge-reward.dto';
import { UpdatePointsRewardDto } from '../dto/rewards/update-points-reward.dto';
import { UpdateBadgeRewardDto } from '../dto/rewards/update-badge-reward.dto';
import { CreateRedeemablePointsRewardDto } from '../dto/rewards/create-redeemable-points-reward.dto';
import { UpdateRedeemablePointsRewardDto } from '../dto/rewards/update-redeemable-points-reward.dto';

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

  @Get('redeemable-points')
  async getRedeemablePointsRewards() {
    return this.gamificationRewardsService.getRedeemablePointsRewards();
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

  @Post('redeemable-points')
  @UseInterceptors(TransactionInterceptor)
  async createRedeemablePoints(
    @Body() createRedeemablePointsRewardDto: CreateRedeemablePointsRewardDto,
    @QueryRunnerParam() queryRunner: QueryRunner,
  ) {
    return this.gamificationRewardsService.createRedeemablePoints(
      createRedeemablePointsRewardDto,
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

  @Put('redeemable-points')
  @UseInterceptors(TransactionInterceptor)
  async updateRedeemablePointsReward(
    @Body() updateRedeemablePointsRewardDto: UpdateRedeemablePointsRewardDto,
    @QueryRunnerParam() queryRunner: QueryRunner,
  ) {
    return this.gamificationRewardsService.updateRedeemablePointsReward(
      updateRedeemablePointsRewardDto,
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
