import { Injectable } from '@nestjs/common';
import { AttendeesTickets } from '../entities/attendees-tickets.entity';
import { DataSource } from 'typeorm';
import { OrganizationsTickets } from '../entities/organizations-tickets.entity';

@Injectable()
export class PaymentOrganizationService {
  constructor(private readonly dataSource: DataSource) {}

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
}
