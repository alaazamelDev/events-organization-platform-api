import { IsExist } from '../../../common/decorators/is_exist.decorator';

export class CreateEventAgeGroupDto {
  @IsExist({ tableName: 'age_groups', column: 'id' })
  age_group_id: number;
}
