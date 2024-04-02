import { IsInt } from 'class-validator';
import { IsExist } from '../../../common/decorators/is_exist.decorator';

export class GetFilledFormDto {
  @IsInt()
  @IsExist({ tableName: 'attendees', column: 'id' })
  attendee_id: number;

  @IsInt()
  @IsExist({ tableName: 'events', column: 'id' })
  event_id: number;
}
