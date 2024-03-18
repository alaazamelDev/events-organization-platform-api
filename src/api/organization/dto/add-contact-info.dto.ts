import { IsNotEmpty } from 'class-validator';
import { IsExist } from '../../../common/decorators/is_exist.decorator';

export class AddContactInfoDto {
  @IsNotEmpty()
  @IsExist({ tableName: 'contacts', column: 'id' })
  contact_id: number;

  @IsNotEmpty()
  content: string;
}
