import { IsNotEmpty, Validate } from 'class-validator';
import { IsExist } from '../../../../common/decorators/is_exist.decorator';
import { IsRewardAlreadyAssignedConstraint } from '../../validators/is_reward_already_assigned_constraint';

export class AssignRewardToRuleDto {
  @IsNotEmpty()
  @IsExist({ tableName: 'g_rewards', column: 'id' })
  @Validate(IsRewardAlreadyAssignedConstraint)
  reward_id: number;
}
