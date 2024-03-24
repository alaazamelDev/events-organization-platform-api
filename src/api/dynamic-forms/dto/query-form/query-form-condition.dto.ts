import { IsInt, IsNotEmpty } from 'class-validator';
import { IsExist } from '../../../../common/decorators/is_exist.decorator';

export class QueryFormConditionDto {
  @IsInt()
  field_id: number;

  @IsNotEmpty()
  value: string | number;

  @IsNotEmpty()
  @IsExist({ tableName: 'operators', column: 'id' })
  operator_id: number;
}
