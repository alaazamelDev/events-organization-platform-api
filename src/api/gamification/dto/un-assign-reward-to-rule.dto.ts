import { IsNotEmpty } from 'class-validator';
import { IsExist } from '../../../common/decorators/is_exist.decorator';

export class UnAssignRewardToRuleDto {
  @IsNotEmpty()
  @IsExist({ tableName: 'g_rewards', column: 'id' })
  reward_id: number;
}
