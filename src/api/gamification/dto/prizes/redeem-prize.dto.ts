import { ArrayMinSize, IsNotEmpty, ValidateNested } from 'class-validator';
import { SelectedPrizesDto } from './selected-prizes.dto';
import { Type } from 'class-transformer';

export class RedeemPrizeDto {
  @IsNotEmpty()
  @Type(() => SelectedPrizesDto)
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  prizes: SelectedPrizesDto[];
}
