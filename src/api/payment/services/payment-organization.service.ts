import { Injectable } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';
import { OrganizationsTickets } from '../entities/organizations-tickets.entity';
import { Event } from '../../event/entities/event.entity';
import { Attendee } from '../../attendee/entities/attendee.entity';
import { EmployeeService } from '../../employee/employee.service';
import { OrganizationWithdrawRequestDto } from '../dto/organization-withdraw-request.dto';
import { OrganizationWithdraw } from '../entities/organization-withdraw.entity';
import { OrganizationWithdrawStatusEnum } from '../enums/organization-withdraw-status.enum';
import { Organization } from '../../organization/entities/organization.entity';
import { ManageOrganizationWithdrawRequestDto } from '../dto/manage-organization-withdraw-request.dto';

@Injectable()
export class PaymentOrganizationService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly employeeService: EmployeeService,
  ) {}

  async getOrganizationTicketsBalance(organizationID: number) {
    return (
      (await this.dataSource
        .getRepository(OrganizationsTickets)
        .createQueryBuilder('orgTickets')
        .select([])
        .where('orgTickets.organization = :orgID', {
          orgID: organizationID,
        })
        .groupBy('orgTickets.organization')
        .addSelect('SUM(orgTickets.value)', 'balance')
        .getRawOne()) || { balance: '0' }
    );
  }

  async getOrganizationTicketsHistory(organizationID: number) {
    return this.dataSource
      .getRepository(OrganizationsTickets)
      .createQueryBuilder('org_tickets')
      .where('org_tickets.organization = :orgID', { orgID: organizationID })
      .leftJoinAndSelect(
        Event,
        'event',
        `event.id = CAST(JSONB_EXTRACT_PATH_TEXT(org_tickets.data, 'event_id') AS BIGINT)`,
      )
      .leftJoinAndSelect(
        Attendee,
        'attendee',
        `attendee.id = CAST(JSONB_EXTRACT_PATH_TEXT(org_tickets.data, 'attendee_id') AS BIGINT)`,
      )
      .leftJoin('attendee.user', 'user')
      .addSelect(['user.id', 'user.email', 'user.username'])
      .getRawMany();
  }

  async organizationWithdrawRequest(
    organizationWithdrawRequestDto: OrganizationWithdrawRequestDto,
    userID: number,
  ) {
    const employee = await this.employeeService.findByUserId(userID);

    const withdraw = this.dataSource
      .getRepository(OrganizationWithdraw)
      .create({
        amount: organizationWithdrawRequestDto.amount,
        status: OrganizationWithdrawStatusEnum.waiting,
        organization: { id: employee.organizationId } as Organization,
      });

    await this.dataSource.manager.save(withdraw);

    return withdraw;
  }

  async manageOrganizationWithdrawRequest(
    dto: ManageOrganizationWithdrawRequestDto,
    queryRunner: QueryRunner,
  ) {
    const withdraw = await this.dataSource
      .getRepository(OrganizationWithdraw)
      .createQueryBuilder()
      .where('id = :withdrawID', {
        withdrawID: dto.withdraw_id,
      })
      .getOneOrFail();

    withdraw.status = dto.status;
    await queryRunner.manager.save(withdraw, { reload: true });

    if (dto.status === OrganizationWithdrawStatusEnum.accepted) {
      const consumed = this.dataSource
        .getRepository(OrganizationsTickets)
        .create({
          organization_id: withdraw.organization_id,
          value: Number(withdraw.amount) * -1,
          data: { withdraw_id: withdraw.id },
        });

      await queryRunner.manager.save(consumed);
    }

    return withdraw;
  }
}
