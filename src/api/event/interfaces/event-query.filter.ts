import { GenericFilter } from '../../../common/interfaces/query.interface';
import { Transform } from 'class-transformer';
import { IsDateFormat } from '../../../common/decorators/is-date-format.decorator';
import { DEFAULT_DB_DATE_FORMAT } from '../../../common/constants/constants';
import { IsBoolean, IsOptional } from 'class-validator';

export class EventQueryFilter extends GenericFilter {
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDateFormat(DEFAULT_DB_DATE_FORMAT)
  start_date?: Date;

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDateFormat(DEFAULT_DB_DATE_FORMAT)
  end_date?: Date;

  addresses?: string[];

  @IsOptional()
  @Transform(({ value }) =>
    value === 'true' || value === 'false' ? value === 'true' : value,
  )
  @IsBoolean()
  most_popular: boolean = true;
}
