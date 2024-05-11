import { Injectable } from '@nestjs/common';
import { Event } from '../event/entities/event.entity';
import { DataSource } from 'typeorm';
import { GenericFilter } from '../../common/interfaces/query.interface';
import { Organization } from '../organization/entities/organization.entity';
import { AttendeeEvent } from '../attend-event/entities/attendee-event.entity';
import { AttendeeEventStatus } from '../attend-event/enums/attendee-event-status.enum';

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

  async getPopularEvents(query: GenericFilter) {
    const events = await this.getFutureEvents();

    const eventsWithRanks = await Promise.all(
      events.map(async (event) => {
        const rank =
          (await this.getEventPopularity(event)) +
          this.getEventRecentness(event);

        return { ...event, rank: rank };
      }),
    );

    return {
      events: eventsWithRanks
        .sort((eventA, eventB) => eventB.rank - eventA.rank)
        .slice((query.page - 1) * query.pageSize, query.page * query.pageSize),
      count: eventsWithRanks.length,
    };
  }

  private async getFutureEvents() {
    return await this.dataSource
      .getRepository(Event)
      .createQueryBuilder('event')
      .innerJoin('event.days', 'ed')
      .groupBy('event.id')
      .addSelect('MIN(ed.dayDate)', 'start_day')
      .orderBy('start_day')
      .having('MIN(ed.dayDate) >= :nowDATE', { nowDATE: new Date() })
      .getRawMany();
  }

  private async getEventPopularity(event: any) {
    const capacity = event['event_capacity'];
    const attendees = await this.dataSource
      .getRepository(AttendeeEvent)
      .createQueryBuilder('attendeeEvent')
      .where('attendeeEvent.event = :eventID', { eventID: event.event_id })
      .andWhere('attendeeEvent.status = :status', {
        status: AttendeeEventStatus.accepted,
      })
      .getCount();

    return attendees / capacity;
  }

  private getEventRecentness(event: any) {
    const currentDate: Date = new Date();
    const eventDate = new Date(event['start_day']);

    const timeDifference: number = eventDate.getTime() - currentDate.getTime();

    const normalizedTimeDifference: number =
      timeDifference /
      (Math.max(eventDate.getTime(), currentDate.getTime()) -
        Math.min(eventDate.getTime(), currentDate.getTime()));

    return Math.min(Math.max(normalizedTimeDifference, 0), 1);
  }
}
