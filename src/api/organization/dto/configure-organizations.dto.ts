import { IsNotEmpty, IsString } from 'class-validator';
import { AddContactInfoDto } from './add-contact-info.dto';
import { IsExist } from '../../../common/decorators/is_exist.decorator';

type CONTACTINFO = {
  id: number;
  content: string;
};

export class ConfigureOrganizationsDto {
  @IsNotEmpty()
  @IsExist({ tableName: 'organizations', column: 'id' })
  organization_id: number;

  @IsString()
  bio: string;

  @IsString()
  description: string;

  @IsNotEmpty()
  contact_info: [AddContactInfoDto];
}
