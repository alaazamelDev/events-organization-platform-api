import { IsExist } from '../../../common/decorators/is_exist.decorator';
import { IsDefined, IsOptional, ValidateNested } from 'class-validator';
import { CreateEventDaySlotDto } from '../../event/dto/create-event-day-slot.dto';
import { IsDateFormat } from '../../../common/decorators/is-date-format.decorator';
import { Type } from 'class-transformer';

export class CreateEventDayRequest {
  @IsDefined()
  @IsExist({ tableName: 'events', column: 'id' })
  event_id: number;

  @IsDateFormat('DD-MM-YYYY')
  day_date!: Date;

  @IsOptional()
  @Type(() => CreateEventDaySlotDto)
  @ValidateNested({ each: true })
  slots: CreateEventDaySlotDto[];
}
