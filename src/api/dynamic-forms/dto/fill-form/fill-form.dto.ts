import { IsArray, IsNotEmpty, Validate, ValidateNested } from 'class-validator';
import { IsExist } from '../../../../common/decorators/is_exist.decorator';
import { FillFormFieldDto } from './fill-form-field.dto';
import { Type } from 'class-transformer';
import { IsFieldBelongsToForm } from '../../validators/is_field_belongs_to_form_constraint';
import { AreRequiredFieldsProvidedConstraint } from '../../validators/are_required_fields_provided_constraint';

export class FillFormDto {
  @IsNotEmpty()
  @IsExist({ tableName: 'events', column: 'id' })
  event_id: number;

  @IsNotEmpty()
  @IsExist({ tableName: 'forms', column: 'id' })
  form_id: number;

  // @IsInt()
  // @IsExist({ tableName: 'attendees', column: 'id' })
  // attendee_id: number;

  @IsArray()
  @Type(() => FillFormFieldDto)
  @ValidateNested({ each: true })
  @Validate(IsFieldBelongsToForm)
  @Validate(AreRequiredFieldsProvidedConstraint)
  fields: FillFormFieldDto[];
}
