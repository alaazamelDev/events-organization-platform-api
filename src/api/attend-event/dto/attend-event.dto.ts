import { IsNotEmpty, Validate } from 'class-validator';
import { IsExist } from '../../../common/decorators/is_exist.decorator';
import { IsEventInRegisterPeriodConstraint } from '../validators/is_event_in_register_period_constraint';

export class AttendEventDto {
  @IsNotEmpty()
  @IsExist({ tableName: 'events', column: 'id' })
  @Validate(IsEventInRegisterPeriodConstraint)
  event_id: number;
}
