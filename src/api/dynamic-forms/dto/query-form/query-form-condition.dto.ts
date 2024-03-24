import { IsInt, IsNotEmpty } from 'class-validator';

export class QueryFormConditionDto {
  @IsInt()
  field_id: number;

  @IsNotEmpty()
  value: string;

  @IsNotEmpty()
  operator: string;
}
