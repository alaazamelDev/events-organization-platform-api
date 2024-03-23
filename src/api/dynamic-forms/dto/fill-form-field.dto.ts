import { IsInt, IsString, Validate, ValidateIf } from 'class-validator';
import { IsFieldOptionRequiredConstraint } from '../validators/is_field_option_required_constraint';
import { IsOptionBelongsToTheFieldConstraint } from '../validators/is_option_belongs_to_the_field_constraint';

export class FillFormFieldDto {
  @IsInt()
  field_id: number;

  @IsString()
  value: string;

  @Validate(IsFieldOptionRequiredConstraint)
  @Validate(IsOptionBelongsToTheFieldConstraint)
  option_id: number;
}
