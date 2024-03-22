import { IsDefined, IsOptional, IsString } from 'class-validator';
import { IsExist } from '../../../common/decorators/is_exist.decorator';

export class AttendeeContactDto {
  @IsOptional()
  @IsExist({ tableName: 'attendee_contact', column: 'id' })
  id?: number;

  @IsDefined()
  @IsExist({ tableName: 'contacts', column: 'id' })
  contact_id: number;

  @IsString()
  @IsDefined()
  contact_link: string;
}
