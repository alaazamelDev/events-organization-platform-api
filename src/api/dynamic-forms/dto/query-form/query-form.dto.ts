import { IsInt } from 'class-validator';

export class QueryFormDto {
  @IsInt()
  event_id: number;

  groups: [];
}
