import { CreateRewardDto } from './create-reward.dto';
import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class CreatePointsRewardDto extends CreateRewardDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  value: number;
}
