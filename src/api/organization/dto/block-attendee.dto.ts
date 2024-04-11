import { IsExist } from '../../../common/decorators/is_exist.decorator';
import { IsDefined } from 'class-validator';

export class BlockAttendeeDto {
  @IsDefined()
  @IsExist({ tableName: 'attendees', column: 'id' })
  attendee_id: number;
}
