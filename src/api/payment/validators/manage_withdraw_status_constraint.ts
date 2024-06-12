import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { ManageOrganizationWithdrawRequestDto } from '../dto/manage-organization-withdraw-request.dto';
import { OrganizationWithdraw } from '../entities/organization-withdraw.entity';
import { OrganizationWithdrawStatusEnum } from '../enums/organization-withdraw-status.enum';

@ValidatorConstraint({
  name: 'ManageWithdrawStatusConstraint',
  async: true,
})
@Injectable()
export class ManageWithdrawStatusConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly entityManager: EntityManager) {}

  async validate(_value: any, _args?: ValidationArguments): Promise<boolean> {
    const object = _args?.object as ManageOrganizationWithdrawRequestDto;

    const withdrawStatus = await this.entityManager
      .getRepository(OrganizationWithdraw)
      .createQueryBuilder()
      .where('id = :withdrawID', {
        withdrawID: object.withdraw_id,
      })
      .getOneOrFail()
      .then((obj) => obj.status);

    return withdrawStatus !== OrganizationWithdrawStatusEnum.accepted;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    const object =
      validationArguments?.object as ManageOrganizationWithdrawRequestDto;
    return `the status is already accepted and can not be changed to ${object.status}`;
  }
}
