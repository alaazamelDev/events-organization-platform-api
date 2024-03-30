import { IsInt } from 'class-validator';
import { IsExist } from '../../../common/decorators/is_exist.decorator';

export class GetEventAttendeesDto {
  @IsInt()
  @IsExist({ tableName: 'events', column: 'id' })
  event_id: number;
}
