import { IsNotEmpty, Max, Min } from 'class-validator';
import { IsExist } from '../../../common/decorators/is_exist.decorator';

export class GenerateGiftCardsDto {
  @IsNotEmpty()
  @Min(1)
  @Max(1000)
  amount: number;

  @IsNotEmpty()
  @IsExist({ tableName: 'gift_card_variants', column: 'id' })
  variant_id: number;
}
