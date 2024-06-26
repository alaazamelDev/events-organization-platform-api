import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { CreateRuleDto } from '../dto/rules/create-rule.dto';
import { DefinedDataEnum } from '../constants/defined-data.constant';
import { DataSource } from 'typeorm';
import { RewardEntity } from '../entities/rewards/reward.entity';
import { RewardTypesEnum } from '../constants/reward-types.constant';
import { AssignRewardToRuleDto } from '../dto/rewards/assign-reward-to-rule.dto';

@ValidatorConstraint({
  name: 'DoesDefinedDataTypeConflictWithTheRewardConstraint',
  async: true,
})
export class DoesDefinedDataTypeConflictWithTheRewardConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly dataSource: DataSource) {}

  async validate(_text: any, _args: ValidationArguments) {
    const object = _args.object as CreateRuleDto;
    const conditions = object.conditions;
    const rewards = object.rewards;

    const result = await Promise.all(
      conditions.map(async (condition) => {
        if (+condition.defined_data_id === +DefinedDataEnum.EARN_POINTS) {
          return await this.checkFormConflict(rewards, RewardTypesEnum.POINTS);
        } else if (+condition.defined_data_id === +DefinedDataEnum.EARN_BADGE) {
          return await this.checkFormConflict(rewards, RewardTypesEnum.BADGE);
        } else {
          return true;
        }
      }),
    );

    return !result.includes(false);
  }

  async checkFormConflict(
    rewards: AssignRewardToRuleDto[],
    rewardType: RewardTypesEnum,
  ) {
    const result = await Promise.all(
      rewards.map(async (reward) => {
        const reward_entity = await this.dataSource
          .getRepository(RewardEntity)
          .createQueryBuilder()
          .where('id = :rewardID', { rewardID: reward.reward_id })
          .getOneOrFail();

        return Number(reward_entity.type_id) !== Number(rewardType);
      }),
    );

    return !result.includes(false);
  }

  defaultMessage(_args: ValidationArguments) {
    return `The Selected Triggers Conflict With The Selected Rewards Types`;
  }
}
