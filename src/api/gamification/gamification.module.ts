import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DefinedDataEntity } from './entities/data-definition/defined-data.entity';
import { OperatorEntity } from './entities/data-definition/operator.entity';
import { DefinedDataOperatorsEntity } from './entities/data-definition/defined-data-operators.entity';
import { InsertedDataEntity } from './entities/data-insertion/inserted-data.entity';
import { RewardEntity } from './entities/rewards/reward.entity';
import { BadgeEntity } from './entities/rewards/badge.entity';
import { PointsEntity } from './entities/rewards/points.entity';
import { RewardTypeEntity } from './entities/rewards/reward-type.entity';
import { RuleEntity } from './entities/rules/rule.entity';
import { RuleConditionEntity } from './entities/rules/rule-condition.entity';
import { RewardedDataEntity } from './entities/rules/rewarded-data.entity';
import { AttendeePointsEntity } from './entities/rewards-attendee/attendee-points.entity';
import { AttendeeBadgeEntity } from './entities/rewards-attendee/attendee-badge.entity';
import { GamificationService } from './services/gamification.service';
import { GamificationController } from './cotrollers/gamification.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DefinedDataEntity,
      OperatorEntity,
      DefinedDataOperatorsEntity,
      InsertedDataEntity,
      RewardEntity,
      RewardTypeEntity,
      BadgeEntity,
      PointsEntity,
      RuleEntity,
      RuleConditionEntity,
      RewardedDataEntity,
      AttendeePointsEntity,
      AttendeeBadgeEntity,
    ]),
  ],
  providers: [GamificationService],
  controllers: [GamificationController],
})
export class GamificationModule {}
