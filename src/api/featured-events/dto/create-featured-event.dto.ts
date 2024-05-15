import { IsNotEmpty, Validate } from 'class-validator';
import { IsExist } from '../../../common/decorators/is_exist.decorator';
import { IsDateFormat } from '../../../common/decorators/is-date-format.decorator';
import { IsFeaturedEventStartDateEndDateCorrectConstraint } from '../validators/is_featured_event_start_date_end_date_correct_constraint';

export class CreateFeaturedEventDto {
  @IsNotEmpty()
  @IsExist({ tableName: 'events', column: 'id' })
  event_id: number;

  @IsNotEmpty()
  @IsDateFormat('YYYY-MM-DD')
  @Validate(IsFeaturedEventStartDateEndDateCorrectConstraint)
  start_date: Date;

  @IsNotEmpty()
  @IsDateFormat('YYYY-MM-DD')
  end_date: Date;

  @IsNotEmpty()
  @IsExist({ tableName: 'featured_events_types', column: 'id' })
  type_id: number;
}
