import { CreateFormGroupDto } from '../create-form/create-form-group.dto';
import { IsNotEmpty } from 'class-validator';
import { IsExist } from '../../../../common/decorators/is_exist.decorator';

export class AddGroupDto extends CreateFormGroupDto {
  @IsNotEmpty()
  @IsExist({ tableName: 'forms', column: 'id' })
  form_id: number;
}
