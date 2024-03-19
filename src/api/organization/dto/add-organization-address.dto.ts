import { IsNotEmpty } from 'class-validator';
import { IsExist } from '../../../common/decorators/is_exist.decorator';

export class AddOrganizationAddressDto {
  @IsNotEmpty()
  @IsExist({ tableName: 'addresses', column: 'id' })
  address_id: number;
}
