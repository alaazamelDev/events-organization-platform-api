import { IsDate, IsString, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEventDaySlotDto {
  @IsString()
  @MaxLength(255)
  label!: string;

  @Type(() => Date)
  @IsDate()
  start_time: Date;

  @Type(() => Date)
  @IsDate()
  end_time: Date;
}
