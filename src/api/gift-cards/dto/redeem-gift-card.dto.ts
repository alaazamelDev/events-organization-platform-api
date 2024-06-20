import { IsNotEmpty, IsString } from 'class-validator';

export class RedeemGiftCardDto {
  @IsNotEmpty()
  @IsString()
  code: string;
}
