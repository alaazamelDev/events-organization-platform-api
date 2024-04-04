import { IsDateFormat } from '../../../common/decorators/is-date-format.decorator';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { CreateEventDaySlotDto } from './create-event-day-slot.dto';

export class CreateEventDayDto {
  @IsDateFormat('YYYY-MM-DD')
  day_date!: Date;

  @IsOptional()
  @Type(() => CreateEventDaySlotDto)
  @ValidateNested({ each: true })
  slots: CreateEventDaySlotDto[];
}
