import { EventTagDto } from './event-tag.dto';
import { IsExist } from '../../../common/decorators/is_exist.decorator';
import { IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateEventTagsDto {
  @IsOptional()
  @Type(() => EventTagDto)
  @ValidateNested({ each: true })
  added_tags: EventTagDto[];

  @IsOptional()
  @Type(() => EventTagDto)
  @ValidateNested({ each: true })
  deleted_tags: EventTagDto[];
}
