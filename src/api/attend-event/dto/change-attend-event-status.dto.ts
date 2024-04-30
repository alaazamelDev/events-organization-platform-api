import { AttendeeEventStatus } from '../enums/attendee-event-status.enum';
import { IsEnum, IsNotEmpty, Validate } from 'class-validator';
import { IsExist } from '../../../common/decorators/is_exist.decorator';
import { IsEventCapacityCanHoldConstraint } from '../validators/is_event_capacity_can_hold_constraint';

export class ChangeAttendEventStatusDto {
  @IsNotEmpty()
  @IsExist({ tableName: 'events', column: 'id' })
  @Validate(IsEventCapacityCanHoldConstraint)
  event_id: number;

  @IsNotEmpty()
  @IsExist({ tableName: 'attendees', column: 'id' })
  attendee_id: number;

  @IsNotEmpty()
  @IsEnum(AttendeeEventStatus)
  status: AttendeeEventStatus;
}
