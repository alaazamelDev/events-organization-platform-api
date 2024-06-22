import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  ArrayMaxSize,
} from 'class-validator';

export class PrintGiftCardsDto {
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  gift_cards_ids: number[];
}
