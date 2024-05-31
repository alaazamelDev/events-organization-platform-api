import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { EntityManager } from 'typeorm';
import { AssignRewardToRuleDto } from '../dto/assign-reward-to-rule.dto';
import { RewardEntity } from '../entities/rewards/reward.entity';

@ValidatorConstraint({
  name: 'IsRewardAlreadyAssignedConstraint',
  async: true,
})
export class IsRewardAlreadyAssignedConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly entityManager: EntityManager) {}

  async validate(_text: any, _args: ValidationArguments) {
    const object = _args.object as AssignRewardToRuleDto;

    return await this.entityManager
      .getRepository(RewardEntity)
      .createQueryBuilder('reward')
      .where('reward.id = :rewardID', { rewardID: object.reward_id })
      .andWhere('reward.rule IS NULL')
      .getExists();
  }

  defaultMessage(_args: ValidationArguments) {
    const object = _args.object as AssignRewardToRuleDto;
    return `provided reward ${object.reward_id} already assigned to another rule`;
  }
}
