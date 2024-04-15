import { IsNotEmpty, Validate } from 'class-validator';
import { CreateFormFieldOptionDto } from '../create-form/create-form-field-option.dto';
import { IsExist } from '../../../../common/decorators/is_exist.decorator';
import { IsFieldTypeSupportOptionsConstraint } from '../../validators/is_field_type_support_options_constraint';

export class AddOptionDto extends CreateFormFieldOptionDto {
  @IsNotEmpty()
  @IsExist({ tableName: 'form_fields', column: 'id' })
  @Validate(IsFieldTypeSupportOptionsConstraint)
  field_id: number;
}
