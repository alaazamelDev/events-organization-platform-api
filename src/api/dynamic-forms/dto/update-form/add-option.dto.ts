import { IsNotEmpty, IsString, Validate } from 'class-validator';
import { CreateFormFieldOptionDto } from '../create-form/create-form-field-option.dto';
import { IsExist } from '../../../../common/decorators/is_exist.decorator';
import { IsFieldTypeSupportOptionsConstraint } from '../../validators/is_field_type_support_options_constraint';
import { IsOptionNameUniqueConstraint } from '../../validators/is_option_name_unique_constraint.dto';

export class AddOptionDto {
  @IsNotEmpty()
  @IsExist({ tableName: 'form_fields', column: 'id' })
  @Validate(IsFieldTypeSupportOptionsConstraint)
  field_id: number;

  @IsString()
  @Validate(IsOptionNameUniqueConstraint)
  name: string;
}
