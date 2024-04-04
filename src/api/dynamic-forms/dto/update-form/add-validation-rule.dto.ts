import { CreateFormFieldValidationRuleDto } from '../create-form/create-form-field-validation-rule.dto';
import { IsNotEmpty, Validate } from 'class-validator';
import { IsExist } from '../../../../common/decorators/is_exist.decorator';
import { IsFieldTypeSupportValidationRulesConstraint } from '../../validators/is_field_type_support_validation_rules_constraint';

export class AddValidationRuleDto extends CreateFormFieldValidationRuleDto {
  @IsNotEmpty()
  @IsExist({ tableName: 'form_fields', column: 'id' })
  @Validate(IsFieldTypeSupportValidationRulesConstraint)
  field_id: number;
}
