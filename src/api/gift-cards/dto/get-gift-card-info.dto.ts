import { IsNotEmpty, IsString } from 'class-validator';

export class GetGiftCardInfoDto {
  @IsNotEmpty()
  @IsString()
  code: string;
}
