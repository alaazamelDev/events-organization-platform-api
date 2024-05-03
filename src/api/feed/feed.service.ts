import { Injectable } from '@nestjs/common';
import { Event } from '../event/entities/event.entity';
import { DataSource, Repository } from 'typeorm';
import { GenericFilter } from '../../common/interfaces/query.interface';
import { Organization } from '../organization/entities/organization.entity';

@Injectable()
export class FeedService {
  constructor(private readonly dataSource: DataSource) {}

  async getSoonEvents(query: GenericFilter) {
    const events = await this.dataSource
      .getRepository(Event)
      .createQueryBuilder('e')
      .innerJoin('e.days', 'ed')
      .groupBy('e.id')
      .addSelect('MIN(ed.dayDate)', 'start_day')
      .orderBy('start_day')
      .having('MIN(ed.dayDate) >= :nowDATE', { nowDATE: new Date() })
      .skip((query.page - 1) * query.pageSize)
      .take(query.pageSize)
      .getManyAndCount();

    return {
      data: events[0],
      count: events[1],
    };
  }

  async getOrganizations(query: GenericFilter) {
    return {
      data: await this.dataSource
        .getRepository(Organization)
        .createQueryBuilder('org')
        .select(['org.id', 'org.name'])
        .addSelect('COUNT(attendee.id) AS attendees_num')
        .addSelect('COUNT(DISTINCT event.id) AS events_num')
        .leftJoin('org.events', 'event')
        .leftJoin('event.attendees', 'attendee')
        .groupBy('org.id')
        .orderBy('events_num', 'DESC')
        .addOrderBy('attendees_num', 'DESC')
        .offset((query.page - 1) * query.pageSize)
        .limit(query.pageSize)
        .getRawMany(),
      count: await this.dataSource.getRepository(Organization).count(),
    };
  }
}
