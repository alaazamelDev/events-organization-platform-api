import { CreateRewardDto } from './create-reward.dto';
import { IsBoolean, IsJSON, IsNotEmpty } from 'class-validator';

export class CreateBadgeRewardDto extends CreateRewardDto {
  @IsNotEmpty()
  @IsJSON()
  shape: {};

  @IsNotEmpty()
  @IsBoolean()
  anonymous: boolean;

  @IsNotEmpty()
  @IsBoolean()
  visibility: boolean;
}
