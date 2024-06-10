import { IsExist } from '../../../../common/decorators/is_exist.decorator';
import { IsNotEmpty } from 'class-validator';

export class SelectedPrizesDto {
  @IsNotEmpty()
  @IsExist({ tableName: 'g_prizes', column: 'id' })
  prize_id: number;
}
