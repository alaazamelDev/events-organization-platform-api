import {
  IsInt,
  IsNotEmpty,
  IsString,
  Validate,
  ValidateIf,
} from 'class-validator';
import { IsFieldOptionRequiredConstraint } from '../validators/is_field_option_required_constraint';
import { IsOptionBelongsToTheFieldConstraint } from '../validators/is_option_belongs_to_the_field_constraint';
import { IsFieldValueCorrectConstraint } from '../validators/is_field_value_correct_constraint';

export class FillFormFieldDto {
  @IsInt()
  field_id: number;

  @IsNotEmpty()
  @Validate(IsFieldValueCorrectConstraint)
  value: string;

  @Validate(IsFieldOptionRequiredConstraint)
  @Validate(IsOptionBelongsToTheFieldConstraint)
  option_id: number;
}
