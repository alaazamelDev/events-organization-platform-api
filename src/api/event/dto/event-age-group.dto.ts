import { IsExist } from '../../../common/decorators/is_exist.decorator';

export class EventAgeGroupDto {
  @IsExist({ tableName: 'age_groups', column: 'id' })
  age_group_id: number;
}
