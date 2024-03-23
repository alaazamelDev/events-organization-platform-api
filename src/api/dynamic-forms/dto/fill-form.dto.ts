import { IsArray, IsInt, Validate, ValidateNested } from 'class-validator';
import { IsExist } from '../../../common/decorators/is_exist.decorator';
import { FillFormFieldDto } from './fill-form-field.dto';
import { Type } from 'class-transformer';
import { IsFieldBelongsToForm } from '../validators/is_field_belongs_to_form_constraint';
import { AreRequiredFieldsProvidedConstraint } from '../validators/are_required_fields_provided_constraint';

export class FillFormDto {
  @IsInt()
  @IsExist({ tableName: 'events', column: 'id' })
  event_id: number;

  @IsInt()
  @IsExist({ tableName: 'forms', column: 'id' })
  //TODO, validate if this form belongs to the organizer of the event
  form_id: number;

  @IsInt()
  @IsExist({ tableName: 'attendees', column: 'id' })
  attendee_id: number;

  @IsArray()
  @Type(() => FillFormFieldDto)
  @ValidateNested({ each: true })
  @Validate(IsFieldBelongsToForm)
  @Validate(AreRequiredFieldsProvidedConstraint)
  fields: FillFormFieldDto[];
}
