import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRewardDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
