import { Injectable } from '@nestjs/common';
import { AwardStrategy } from './award-strategies/award.strategy.interface';
import { RewardTypesEnum } from '../constants/reward-types.constant';
import { AwardPointsStrategy } from './award-strategies/award-points.strategy';
import { AwardBadgeStrategy } from './award-strategies/award-badge.strategy';
import { DataSource } from 'typeorm';

@Injectable()
export class AwardService {
  private readonly strategies: { [key: number]: AwardStrategy };

  constructor(private readonly dataSource: DataSource) {
    this.strategies = {
      [RewardTypesEnum.POINTS]: new AwardPointsStrategy(dataSource),
      [RewardTypesEnum.BADGE]: new AwardBadgeStrategy(dataSource),
    };
  }

  getStrategy(reward_type: RewardTypesEnum) {
    return this.strategies[reward_type];
  }
}
