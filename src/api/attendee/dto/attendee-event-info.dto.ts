import { IsNotEmpty } from 'class-validator';
import { IsExist } from '../../../common/decorators/is_exist.decorator';

export class AttendeeEventInfoDto {
  @IsNotEmpty()
  @IsExist({ tableName: 'events', column: 'id' })
  event_id: number;

  @IsNotEmpty()
  @IsExist({ tableName: 'attendees', column: 'id' })
  attendee_id: number;
}
