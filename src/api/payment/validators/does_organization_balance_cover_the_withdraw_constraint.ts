import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { ManageOrganizationWithdrawRequestDto } from '../dto/manage-organization-withdraw-request.dto';
import { OrganizationWithdraw } from '../entities/organization-withdraw.entity';
import { OrganizationsTickets } from '../entities/organizations-tickets.entity';
import { OrganizationWithdrawStatusEnum } from '../enums/organization-withdraw-status.enum';

@ValidatorConstraint({
  name: 'DoesOrganizationBalanceCoverTheWithdrawConstraint',
  async: true,
})
@Injectable()
export class DoesOrganizationBalanceCoverTheWithdrawConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly entityManager: EntityManager) {}

  async validate(_value: any, _args?: ValidationArguments): Promise<boolean> {
    const object = _args?.object as ManageOrganizationWithdrawRequestDto;

    const withdraw = await this.entityManager
      .getRepository(OrganizationWithdraw)
      .createQueryBuilder()
      .where('id = :withdrawID', {
        withdrawID: object.withdraw_id,
      })
      .getOneOrFail();

    const organization_balance = await this.entityManager
      .getRepository(OrganizationsTickets)
      .createQueryBuilder()
      .where('organization_id = :organizationID', {
        organizationID: withdraw.organization_id,
      })
      .getMany()
      .then((result) =>
        result.reduce((acc, obj) => acc + Number(obj.value), 0),
      );

    if (object.status === OrganizationWithdrawStatusEnum.accepted) {
      return organization_balance >= Number(withdraw.amount);
    }

    return true;
  }

  defaultMessage(_validationArguments?: ValidationArguments): string {
    return `organization balance does not cover the withdraw request`;
  }
}
