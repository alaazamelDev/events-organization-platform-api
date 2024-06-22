import { ArrayMinSize, IsArray, IsBoolean, IsNotEmpty } from 'class-validator';

export class ChangeGiftCardsActiveStateDto {
  @IsNotEmpty()
  @IsBoolean()
  state: boolean;

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  gift_cards_ids: number[];
}
