import { Type } from 'class-transformer';
import { IsDateFormat } from '../../../common/decorators/is-date-format.decorator';
import { DEFAULT_DATE_FORMAT } from '../../../common/constants/constants';
import { IsOptional, IsString } from 'class-validator';

export class GetOrganizationBlacklistFiltersDto {
  @IsOptional()
  @Type(() => Date)
  @IsDateFormat(DEFAULT_DATE_FORMAT)
  from?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDateFormat(DEFAULT_DATE_FORMAT)
  to?: Date;

  @IsOptional()
  @IsString()
  name?: string;
}
