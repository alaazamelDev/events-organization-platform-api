import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { OrganizationsTickets } from '../entities/organizations-tickets.entity';
import { Event } from '../../event/entities/event.entity';
import { Attendee } from '../../attendee/entities/attendee.entity';

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
}
