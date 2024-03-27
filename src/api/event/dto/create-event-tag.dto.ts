import { IsExist } from '../../../common/decorators/is_exist.decorator';

export class CreateEventTagDto {
  @IsExist({ tableName: 'tags', column: 'id' })
  tag_id: number;
}
