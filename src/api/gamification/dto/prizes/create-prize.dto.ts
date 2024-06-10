import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreatePrizeDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @Min(1)
  rp_value: number;

  @IsNotEmpty()
  @IsInt()
  rank: number;
}
