import {
  IsDate,
  IsEnum,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { IsExist } from '../../../common/decorators/is_exist.decorator';
import { Type } from 'class-transformer';
import { CreateLocationDto } from './create-location.dto';
import { EventType } from '../enums/event-type.enum';

export class UpdateEventDto {
  id?: number;

  @IsOptional()
  @IsExist({ tableName: 'addresses', column: 'id' })
  address_id?: number;

  @IsOptional()
  @Type(() => CreateLocationDto)
  @ValidateNested()
  location?: CreateLocationDto;

  @IsOptional()
  @IsString()
  address_notes?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  @IsNumberString({ locale: 'en-US' })
  capacity?: number;

  @IsEnum(EventType)
  @IsOptional()
  event_type?: EventType;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  registration_start_date?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  registration_end_date?: Date;

  static toModel(dto: UpdateEventDto) {
    let map: LooseObject = {};
    if (dto.event_type) {
      map.eventType = dto.event_type;
    }

    if (dto.address_id == null) {
      map.address = null;
    } else {
      map.address = { id: dto.address_id };
    }

    if (dto.address_notes == null) {
      map.addressNotes = null;
    } else {
      map.addressNotes = dto.address_notes;
    }

    if (dto.capacity) {
      map.capacity = dto.capacity;
    }

    if (dto.location == null) {
      map.location = null;
    } else {
      map.location = dto.location;
    }

    if (dto.title) {
      map.title = dto.title;
    }

    if (dto.description) {
      map.description = dto.description;
    }

    if (dto.registration_start_date) {
      map.registrationStartDate = dto.registration_start_date;
    }
    if (dto.registration_end_date) {
      map.registrationEndDate = dto.registration_end_date;
    }

    return map;
  }
}
