import { IsExist } from '../../../common/decorators/is_exist.decorator';
import { IsDefined } from 'class-validator';

export class OrganizationFollowingDto {
  @IsDefined()
  @IsExist({ tableName: 'organizations', column: 'id' })
  organization_id: number;
}
