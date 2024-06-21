import { ArrayMinSize, IsArray, IsNotEmpty } from 'class-validator';

export class PrintGiftCardsDto {
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  gift_cards_ids: number[];
}
