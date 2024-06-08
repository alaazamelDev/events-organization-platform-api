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
import { DoesOperatorSupportDefinedDataConstraint } from './validators/does_operator_support_defined_data_constraint';
import { GamificationRewardsService } from './services/gamification-rewards.service';
import { GamificationRewardsController } from './cotrollers/gamification-rewards.controller';
import { IsRewardAlreadyAssignedConstraint } from './validators/is_reward_already_assigned_constraint';
import { GamificationRulesController } from './cotrollers/gamification-rules.controller';
import { GamificationRulesService } from './services/gamification-rules.service';
import { MultipleConditionsOnTheSameDefinedDataInOneRuleConstraint } from './validators/multiple_conditions_on_the_same_defined_data_in_one_rule_constraint';
import { GamificationConditionsService } from './services/gamification-conditions.service';
import { GamificationRulesConditionsController } from './cotrollers/gamification-rules-conditions.controller';
import { IsDefinedDataConditionAlreadyExistInTheSameRuleConstraint } from './validators/is_defined_data_condition_already_exist_in_the_same_rule_constraint';
import { ExecuteRules } from './rules-evaluation/execute-rules';
import { InsertDataSubscriber } from './events-subscribers/insert-data.subscriber';
import { FillFormSubscriber } from './events-subscribers/fill-form.subscriber';
import { BuyPackageSubscriber } from './events-subscribers/buy-package.subscriber';
import { ConsumeTicketsSubscriber } from './events-subscribers/consume-tickets.subscriber';
import { SendMessageSubscriber } from './events-subscribers/send-message.subscriber';
import { OperatorService } from './services/operator.service';
import { GamificationRewardedDataService } from './services/gamification-rewarded-data.service';
import { GamificationInsertedDataService } from './services/gamification-inserted-data.service';
import { AwardService } from './services/award.service';
import { AreConditionsContainsAtLeastOneEqualOperatorConstraint } from './validators/are_conditions_contains_at_least_one_equal_operator_constraint';
import { RedeemablePointsEntity } from './entities/rewards/redeemable-points.entity';
import { AttendeeRedeemablePointsEntity } from './entities/rewards-attendee/attendee-redeemable-points.entity';
import { GamificationAttendeeService } from './services/gamification-attendee.service';
import { EarnBadgeSubscriber } from './events-subscribers/earn-badge.subscriber';
import { GamificationAttendeeController } from './cotrollers/gamification-attendee.controller';
import { PrizeEntity } from './entities/prizes/prize.entity';
import { PrizeTypeEntity } from './entities/prizes/prize-type.entity';
import { TicketPrizeEntity } from './entities/prizes/ticket-prize.entity';
import { GamificationPrizesService } from './services/gamification-prizes.service';
import { GamificationPrizesController } from './cotrollers/gamification-prizes.controller';
import { RedeemService } from './services/redeem.service';
import { AttendeePrizeEntity } from './entities/prizes/attendee-prize.entity';

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
      RedeemablePointsEntity,
      RuleEntity,
      RuleConditionEntity,
      RewardedDataEntity,
      AttendeePointsEntity,
      AttendeeBadgeEntity,
      AttendeeRedeemablePointsEntity,
      PrizeEntity,
      PrizeTypeEntity,
      TicketPrizeEntity,
      AttendeePrizeEntity,
    ]),
  ],
  providers: [
    GamificationService,
    GamificationRewardsService,
    GamificationRulesService,
    GamificationConditionsService,
    GamificationRewardedDataService,
    GamificationInsertedDataService,
    GamificationAttendeeService,
    GamificationPrizesService,

    // Validators
    DoesOperatorSupportDefinedDataConstraint,
    IsRewardAlreadyAssignedConstraint,
    MultipleConditionsOnTheSameDefinedDataInOneRuleConstraint,
    IsDefinedDataConditionAlreadyExistInTheSameRuleConstraint,
    AreConditionsContainsAtLeastOneEqualOperatorConstraint,

    // Subscribers
    InsertDataSubscriber,
    BuyPackageSubscriber,
    ConsumeTicketsSubscriber,
    FillFormSubscriber,
    SendMessageSubscriber,
    EarnBadgeSubscriber,

    ExecuteRules,
    OperatorService,
    AwardService,
    RedeemService,
  ],
  controllers: [
    GamificationController,
    GamificationRewardsController,
    GamificationRulesController,
    GamificationRulesConditionsController,
    GamificationAttendeeController,
    GamificationPrizesController,
  ],
})
export class GamificationModule {}
