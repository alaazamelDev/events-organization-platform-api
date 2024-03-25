import { QueryFormConditionDto } from './query-form-condition.dto';
import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';

export class QueryFormGroupDto {
  @IsNotEmpty()
  @Type(() => QueryFormConditionDto)
  @ValidateNested({ each: true })
  conditions: QueryFormConditionDto[];
}
