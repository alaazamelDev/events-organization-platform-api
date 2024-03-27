import { IsDateFormat } from '../../../common/decorators/is-date-format.decorator';
import { Type } from 'class-transformer';
import { IsDate, IsOptional, ValidateNested } from 'class-validator';
import { CreateEventDaySlotDto } from './create-event-day-slot.dto';

export class CreateEventDayDto {
  @IsDateFormat('DD-MM-YYYY')
  day_date!: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  start_time: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  end_time: Date;

  @IsOptional()
  @Type(() => CreateEventDaySlotDto)
  @ValidateNested({ each: true })
  slots: CreateEventDaySlotDto[];
}
