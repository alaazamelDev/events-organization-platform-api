import { CreateRewardDto } from './create-reward.dto';
import { IsJSON, IsNotEmpty } from 'class-validator';

export class CreateBadgeRewardDto extends CreateRewardDto {
  @IsNotEmpty()
  @IsJSON()
  shape: {};
}
