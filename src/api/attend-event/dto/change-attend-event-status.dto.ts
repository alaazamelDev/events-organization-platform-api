import { AttendeeEventStatus } from '../enums/attendee-event-status.enum';
import { IsEnum, IsNotEmpty, Validate } from 'class-validator';
import { IsExist } from '../../../common/decorators/is_exist.decorator';
import { IsEventCapacityCanHoldConstraint } from '../validators/is_event_capacity_can_hold_constraint';
import { IsAttendeeEventStatusSameConstraint } from '../validators/is_attendee_event_status_same_constraint';
import { IsNewStatusSuitsTheEventConstraint } from '../validators/is_new_status_suits_the_event_constraint';

export class ChangeAttendEventStatusDto {
  @IsNotEmpty()
  @IsExist({ tableName: 'events', column: 'id' })
  @Validate(IsEventCapacityCanHoldConstraint)
  @Validate(IsNewStatusSuitsTheEventConstraint)
  event_id: number;

  @IsNotEmpty()
  @IsExist({ tableName: 'attendees', column: 'id' })
  @Validate(IsAttendeeEventStatusSameConstraint)
  attendee_id: number;

  @IsNotEmpty()
  @IsEnum(AttendeeEventStatus)
  status: AttendeeEventStatus;
}
