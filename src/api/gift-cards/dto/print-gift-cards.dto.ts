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
  @ArrayMaxSize(100)
  gift_cards_ids: number[];
}
