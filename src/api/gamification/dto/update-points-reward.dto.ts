import { PartialType } from '@nestjs/swagger';
import { CreatePointsRewardDto } from './create-points-reward.dto';
import { IsNotEmpty } from 'class-validator';
import { IsExist } from '../../../common/decorators/is_exist.decorator';

export class UpdatePointsRewardDto extends PartialType(CreatePointsRewardDto) {
  @IsNotEmpty()
  @IsExist({ tableName: 'g_points', column: 'id' })
  reward_points_id: number;
}
