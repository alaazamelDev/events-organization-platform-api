import { IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import { IsExist } from '../../../common/decorators/is_exist.decorator';
import {
  DEFAULT_DATE_FORMAT,
  DEFAULT_DB_DATE_FORMAT,
  REGION,
} from '../../../common/constants/constants';
import { IsDateFormat } from '../../../common/decorators/is-date-format.decorator';
import { Job } from '../../job/entities/job.entity';
import { Address } from '../../address/entities/address.entity';
import * as moment from 'moment';

export class UpdateAttendeeProfileDto {
  id?: number;

  @IsOptional()
  @IsExist({ tableName: 'jobs', column: 'id' })
  job_id?: number;

  @IsOptional()
  @IsExist({ tableName: 'addresses', column: 'id' })
  address_id?: number;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsOptional()
  @IsDateFormat('DD-MM-YYYY')
  birth_date?: Date;

  @IsOptional()
  @IsPhoneNumber(REGION)
  phone_number?: string;

  static toModel(dto: UpdateAttendeeProfileDto) {
    return {
      job: dto.job_id ? ({ id: dto.job_id } as Job) : undefined,
      address: dto.address_id ? ({ id: dto.address_id } as Address) : undefined,
      bio: dto.bio ?? undefined,
      birthDate: dto.birth_date
        ? moment(dto.birth_date, DEFAULT_DATE_FORMAT).format(
            DEFAULT_DB_DATE_FORMAT,
          )
        : undefined,
      phoneNumber: dto.phone_number ?? undefined,
    };
  }
}
