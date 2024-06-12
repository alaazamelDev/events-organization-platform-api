import { IsEnum, IsNotEmpty, Validate } from 'class-validator';
import { IsExist } from '../../../common/decorators/is_exist.decorator';
import { OrganizationWithdrawStatusEnum } from '../enums/organization-withdraw-status.enum';
import { ManageWithdrawStatusConstraint } from '../validators/manage_withdraw_status_constraint';
import { DoesOrganizationBalanceCoverTheWithdrawConstraint } from '../validators/does_organization_balance_cover_the_withdraw_constraint';

export class ManageOrganizationWithdrawRequestDto {
  @IsNotEmpty()
  @IsExist({ tableName: 'organization_withdraw', column: 'id' })
  withdraw_id: number;

  @IsNotEmpty()
  @IsEnum(OrganizationWithdrawStatusEnum)
  @Validate(ManageWithdrawStatusConstraint)
  @Validate(DoesOrganizationBalanceCoverTheWithdrawConstraint)
  status: OrganizationWithdrawStatusEnum;
}
