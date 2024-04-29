import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class GenericFilter {
  @Transform(({ value }) => Number(value))
  @IsNumber({}, { message: ' "page" atrribute should be a number' })
  page: number = 1;

  @Transform(({ value }) => Number(value))
  @IsNumber({}, { message: ' "pageSize" attribute should be a number ' })
  pageSize: number = 10;
}
