import { IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { EventAgeGroupDto } from './event-age-group.dto';

export class UpdateEventAgeGroupsDto {
  @IsOptional()
  @Type(() => EventAgeGroupDto)
  @ValidateNested({ each: true })
  added_age_groups: EventAgeGroupDto[];

  @IsOptional()
  @Type(() => EventAgeGroupDto)
  @ValidateNested({ each: true })
  deleted_age_groups: EventAgeGroupDto[];
}
