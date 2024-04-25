import { IsInt, IsNotEmpty, Validate } from 'class-validator';
import { IsExist } from '../../../../common/decorators/is_exist.decorator';
import { IsQueryOperatorSuitsTheFieldConstraint } from '../../validators/is_query_operator_suits_the_field_constraint';

export class QueryFormConditionDto {
  @IsNotEmpty()
  @IsExist({ tableName: 'form_fields', column: 'id' })
  field_id: number;

  @IsNotEmpty()
  value: string | number;

  @IsNotEmpty()
  @IsExist({ tableName: 'operators', column: 'id' })
  @Validate(IsQueryOperatorSuitsTheFieldConstraint)
  operator_id: number;
}
