import { IsInt, ValidateNested } from 'class-validator';
import { QueryFormGroupDto } from './query-form-group.dto';
import { Type } from 'class-transformer';
import { IsExist } from '../../../../common/decorators/is_exist.decorator';

export class QueryFormDto {
  @IsInt()
  @IsExist({ tableName: 'events', column: 'id' })
  event_id: number;

  @Type(() => QueryFormGroupDto)
  @ValidateNested({ each: true })
  groups: QueryFormGroupDto[];
}
