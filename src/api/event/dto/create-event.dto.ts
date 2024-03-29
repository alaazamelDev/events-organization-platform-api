import { IsExist } from '../../../common/decorators/is_exist.decorator';
import { EventType } from '../enums/event-type.enum';
import {
  ArrayNotEmpty,
  IsBoolean,
  IsDate,
  IsDefined,
  IsEnum,
  IsNumberString,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { CreateEventDayDto } from './create-event-day.dto';
import { Type } from 'class-transformer';
import { CreateEventTagDto } from './create-event-tag.dto';
import { CreateEventAgeGroupDto } from './create-event-age-group.dto';

export class CreateEventDto {
  organization_id?: number;

  @IsOptional()
  @IsExist({ tableName: 'addresses', column: 'id' })
  address_id?: number;

  @IsUrl()
  @IsOptional()
  address_link?: string;

  @IsString()
  @IsDefined()
  @MaxLength(255)
  title!: string;

  @IsString()
  @IsDefined()
  description!: string;

  @IsOptional()
  @IsNumberString({ locale: 'en-US' })
  capacity?: number;

  @IsEnum(EventType)
  event_type!: EventType;

  @IsDefined()
  @Type(() => Date)
  @IsDate()
  registration_start_date!: Date;

  @IsDefined()
  @Type(() => Date)
  @IsDate()
  registration_end_date?: Date;

  // Days
  @ArrayNotEmpty()
  @Type(() => CreateEventDayDto)
  @ValidateNested({ each: true })
  days: CreateEventDayDto[];

  // Tags
  @ArrayNotEmpty()
  @Type(() => CreateEventTagDto)
  @ValidateNested({ each: true })
  tags: CreateEventTagDto[];

  // Age Groups
  @ArrayNotEmpty()
  @Type(() => CreateEventAgeGroupDto)
  @ValidateNested({ each: true })
  age_groups: CreateEventAgeGroupDto[];

  @IsOptional()
  @IsBoolean()
  direct_register: boolean = true;
}
