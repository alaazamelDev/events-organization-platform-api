import { IsNotEmpty, IsString, Allow } from 'class-validator';
import { AddContactInfoDto } from './add-contact-info.dto';
import { IsExist } from '../../../common/decorators/is_exist.decorator';
import { AddOrganizationAddressDto } from './add-organization-address.dto';

export class ConfigureOrganizationsDto {
  @IsNotEmpty()
  @IsExist({ tableName: 'organizations', column: 'id' })
  organization_id: number;

  @IsString()
  bio: string;

  @IsString()
  description: string;

  @IsNotEmpty()
  contact_info: AddContactInfoDto[];

  @IsNotEmpty()
  addresses: AddOrganizationAddressDto[];

  @Allow()
  main_picture: any;

  @Allow()
  cover_picture: any;
}
