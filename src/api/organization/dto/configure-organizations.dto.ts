import { IsNotEmpty, IsString, Allow, ValidateNested } from 'class-validator';
import { AddContactInfoDto } from './add-contact-info.dto';
import { IsExist } from '../../../common/decorators/is_exist.decorator';
import { AddOrganizationAddressDto } from './add-organization-address.dto';
import { Type } from 'class-transformer';

export class ConfigureOrganizationsDto {
  @IsNotEmpty()
  @IsExist({ tableName: 'organizations', column: 'id' })
  organization_id: number;

  @IsString()
  bio: string;

  @IsString()
  description: string;

  @IsNotEmpty()
  @Type(() => AddContactInfoDto)
  @ValidateNested({ each: true })
  contact_info: AddContactInfoDto[];

  @IsNotEmpty()
  @Type(() => AddOrganizationAddressDto)
  @ValidateNested({ each: true })
  addresses: AddOrganizationAddressDto[];

  @Allow()
  main_picture: any;

  @Allow()
  cover_picture: any;
}
