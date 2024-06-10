import { PartialType } from '@nestjs/swagger';
import { CreateRedeemablePointsRewardDto } from './create-redeemable-points-reward.dto';
import { IsNotEmpty } from 'class-validator';
import { IsExist } from '../../../../common/decorators/is_exist.decorator';

export class UpdateRedeemablePointsRewardDto extends PartialType(
  CreateRedeemablePointsRewardDto,
) {
  @IsNotEmpty()
  @IsExist({ tableName: 'g_redeemable_points', column: 'id' })
  reward_redeemable_points_id: number;
}
