import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePrizeDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
