import { PartialType } from '@nestjs/swagger';
import { CreateFormFieldDto } from '../create-form/create-form-field.dto';
import { IsNotEmpty, IsOptional, Validate } from 'class-validator';
import { IsExist } from '../../../../common/decorators/is_exist.decorator';
import { IsGroupBelongsToTheFieldFormConstraint } from '../../validators/is_group_belongs_to_the_field_form_constraint';

export class UpdateFormFieldDto extends PartialType(CreateFormFieldDto) {
  @IsOptional()
  @IsExist({ tableName: 'form_groups', column: 'id' })
  @Validate(IsGroupBelongsToTheFieldFormConstraint)
  group_id: number;

  @IsNotEmpty()
  @IsExist({ tableName: 'form_fields', column: 'id' })
  field_id: number;
}
