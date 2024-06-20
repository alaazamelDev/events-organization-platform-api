import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IsExist } from '../../../common/decorators/is_exist.decorator';

export class UpdateGiftCardVariantDto {
  @IsNotEmpty()
  @IsExist({ tableName: 'gift_card_variants', column: 'id' })
  variant_id: number;

  @IsOptional()
  @IsString()
  label: string;

  [key: string]: any;
}
