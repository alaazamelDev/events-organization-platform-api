import { PartialType } from '@nestjs/swagger';
import { CreateBadgeRewardDto } from './create-badge-reward.dto';
import { IsNotEmpty } from 'class-validator';
import { IsExist } from '../../../common/decorators/is_exist.decorator';

export class UpdateBadgeRewardDto extends PartialType(CreateBadgeRewardDto) {
  @IsNotEmpty()
  @IsExist({ tableName: 'g_badges', column: 'id' })
  badge_id: number;

  [key: string]: any;
}
