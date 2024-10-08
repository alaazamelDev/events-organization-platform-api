import { IsNotEmpty } from 'class-validator';
import { IsExist } from '../../../common/decorators/is_exist.decorator';

export class DeleteContactInfoDto {
  @IsNotEmpty()
  @IsExist({ tableName: 'contacts', column: 'id' })
  contact_id: number;
}
