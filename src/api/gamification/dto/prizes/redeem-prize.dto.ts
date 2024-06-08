import { IsNotEmpty } from 'class-validator';
import { IsExist } from '../../../../common/decorators/is_exist.decorator';

export class RedeemPrizeDto {
  @IsNotEmpty()
  @IsExist({ tableName: 'g_prizes', column: 'id' })
  prize_id: number;
}
