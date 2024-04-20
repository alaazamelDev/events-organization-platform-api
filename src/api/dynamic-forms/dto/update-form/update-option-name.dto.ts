import { IsNotEmpty, IsString, Validate } from 'class-validator';
import { IsExist } from '../../../../common/decorators/is_exist.decorator';
import { IsOptionNameUniqueConstraint } from '../../validators/is_option_name_unique_constraint.dto';

export class UpdateOptionNameDto {
  @IsNotEmpty()
  @IsExist({ tableName: 'field_options', column: 'id' })
  option_id: number;

  @IsString()
  @Validate(IsOptionNameUniqueConstraint)
  name: string;
}
