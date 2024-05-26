import { Injectable } from '@nestjs/common';
import { Event } from '../../event/entities/event.entity';
import { DataSource, In, MoreThan } from 'typeorm';
import { GenericFilter } from '../../../common/interfaces/query.interface';
import { Organization } from '../../organization/entities/organization.entity';
import { AttendeeEvent } from '../../attend-event/entities/attendee-event.entity';
import { AttendeeEventStatus } from '../../attend-event/enums/attendee-event-status.enum';
import { AuthUserType } from '../../../common/types/auth-user.type';
import { Attendee } from '../../attendee/entities/attendee.entity';
import { FollowingAttendee } from '../../organization/entities/following-attendee.entity';
import { BlockedAttendee } from '../../organization/entities/blocked-attendee.entity';
import { EventQueryFilter } from '../../event/interfaces/event-query.filter';
import * as moment from 'moment';
import { OrganizationSerializer } from '../../organization/serializers/organization.serializer';
import { FileUtilityService } from '../../../config/files/utility/file-utility.service';

@Injectable()
export class FeedService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly fileUtilityService: FileUtilityService,
  ) {}

  async getEventsOfFollowedOrganizations(
    user: AuthUserType,
    query: GenericFilter,
  ): Promise<[Event[], number]> {
    // get the attendee id.
    const attendeeId: number = await this.dataSource
      .getRepository(Attendee)
      .findOneBy({ user: { id: user.sub } })
      .then((attendee) => attendee!.id);

    // get the list of organization ids that are blocking the attendee.
    const blockedOrganizationIds = await this.dataSource
      .getRepository(BlockedAttendee)
      .find({
        where: { attendee: { id: attendeeId } },
        relations: { organization: true },
        select: { organization: { id: true } },
      })
      .then((entries) => {
        return entries.map((entry) => {
          return entry.organization.id;
        });
      });

    // define the sub-query that can get the list
    // of organization_ids that the attendee is following.
    let followedOrganizationIdsQueryBuilder = this.dataSource
      .getRepository(FollowingAttendee)
      .createQueryBuilder('fa')
      .where('attendee_id = :attendeeId', { attendeeId })
      .innerJoin('fa.organization', 'o')
      .select('o.id', 'id');

    // exclude blocked organizations
    if (blockedOrganizationIds.length > 0) {
      followedOrganizationIdsQueryBuilder
        .andWhere('o.id NOT IN (:...orgIds)')
        .setParameters({ orgIds: blockedOrganizationIds });
    }
    // get the results
    let followedOrganizationIds = await followedOrganizationIdsQueryBuilder
      .getRawMany()
      .then((entries) => {
        return entries.map((entry) => {
          return entry.id;
        });
      });

    let events: Event[] = [];
    let count: number = 0;
    if (followedOrganizationIds.length > 0) {
      // Query the upcoming events for organizations
      // that attendee is following & not being blocked by them.
      let eventIds = await this.dataSource
        .getRepository(Event)
        .createQueryBuilder('e')
        .where('e.organization_id IN (:...ids)')
        .setParameters({ ids: followedOrganizationIds })
        .leftJoin('e.days', 'ed')
        .groupBy('e.id')
        .addSelect('MIN(ed.dayDate)', 'start_day')
        .orderBy('start_day', 'DESC')
        .skip((query.page - 1) * query.pageSize)
        .take(query.pageSize)
        .addSelect('e.id', 'event_id')
        .getRawMany()
        .then((events) => events.map((ev) => +ev.event_id));

      // get the total count
      count = eventIds.length;

      // slice the array of ids
      eventIds = eventIds.slice(
        (query.page - 1) * query.pageSize,
        (query.page - 1) * query.pageSize + query.pageSize,
      );

      events = await this.dataSource.getRepository(Event).find({
        where: {
          id: In(eventIds),
          organization: { id: In(followedOrganizationIds) },
        },
        order: { days: { dayDate: 'DESC' } },
      });
    }

    return [events, count];
  }

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
        .select(['org.id', 'org.name', 'org.description'])
        .addSelect('COUNT(attendee.id) AS attendees_num')
        .addSelect('COUNT(DISTINCT event.id) AS events_num')
        .addSelect('COUNT(DISTINCT following.attendee) AS followers')
        .leftJoin('org.events', 'event')
        .leftJoin('event.attendees', 'attendee')
        .leftJoin('org.followingAttendees', 'following')
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

  public async getEvents(filters: EventQueryFilter) {
    // get the upcoming events
    const events = await this.getAllRawEvents();
    // const events = await this.getFutureEvents();

    // get event ids that match the given locations
    const addressIds: number[] = filters.addresses?.map((add) => +add) ?? [];
    const matchingLocationEvents =
      await this.getEventsIdsInGivenAddresses(addressIds);

    function _filterAddress(event: any): boolean {
      if (!filters.addresses || filters.addresses.length == 0) return true;
      return matchingLocationEvents.includes(+event.event_id);
    }

    function _filterByTitle(event: any): boolean {
      const query: string | undefined = filters.search?.trim().toLowerCase();

      // if empty or not specified...
      if (!query || query.length == 0) return true;

      // otherwise, match with title or description.
      const eventTitleLower: string = event.event_title.toLowerCase();
      const eventDescLower: string = event.event_description.toLowerCase();

      // check for matching
      const isTitleMatching: boolean = eventTitleLower.includes(query);
      const isDescMatching: boolean = eventDescLower.includes(query);

      return isTitleMatching || isDescMatching;
    }

    function _sortByPopularity(ev1: any, ev2: any) {
      return filters.most_popular ? ev1.rank - ev2.rank : ev2.rank - ev1.rank;
    }

    // filter to get only events that match the given address
    const filteredEvents = events
      .filter(_filterByTitle)
      .filter(_filterAddress)
      .filter((event) =>
        this._filterDateRange(filters.start_date, filters.end_date, event),
      );

    const unsortedResult = await this.getEventsWithRank(filteredEvents);
    const count = unsortedResult.length;
    const sortedResult = unsortedResult
      .sort(_sortByPopularity)
      .slice(
        (filters.page - 1) * filters.pageSize,
        filters.page * filters.pageSize,
      );
    const processedEvents = await this.lazyLoadAdditionalData(sortedResult);
    return [processedEvents, count];
  }

  private async getEventsIdsInGivenAddresses(addressIds: number[]) {
    return await this.dataSource
      .getRepository(Event)
      .find({
        where: {
          address: {
            id: addressIds.length > 0 ? In(addressIds) : MoreThan(0),
          },
        },
        select: { id: true },
        loadEagerRelations: false,
      })
      .then((events) => events.map((ev) => +ev.id));
  }

  private async getEventsWithRank(events: any[]) {
    return await Promise.all(
      events.map(async (event) => {
        const rank =
          (await this.getEventPopularity(event)) +
          this.getEventRecentness(event);

        return { ...event, rank: rank };
      }),
    );
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

  private async getAllRawEvents() {
    return await this.dataSource
      .getRepository(Event)
      .createQueryBuilder('event')
      .innerJoin('event.days', 'ed')
      .groupBy('event.id')
      .addSelect('MIN(ed.dayDate)', 'start_day')
      .orderBy('start_day')
      // .having('MIN(ed.dayDate) >= :nowDATE', { nowDATE: new Date() })
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

  private _filterDateRange(
    start_date: Date | undefined,
    end_date: Date | undefined,
    event: any,
  ): boolean {
    // specified date range
    if (start_date && end_date) {
      return moment(event.start_day).isBetween(
        start_date,
        end_date,
        undefined,
        '[]',
      );
    }

    // greater than specific start date
    if (start_date) {
      return moment(event.start_day).isSameOrAfter(start_date);
    }

    // less than a specific end date
    if (end_date) {
      return moment(event.start_day).isSameOrBefore(end_date);
    }

    return true;
  }

  private async lazyLoadAdditionalData(events: any[]) {
    // load organizations.
    // 1. get orgIds.
    const orgIds = new Set(
      events.map((ev) => {
        return +ev.event_organization_id;
      }),
    );

    // 2. load org entries
    const organizations = await this.dataSource
      .getRepository(Organization)
      .find({ where: { id: In(Array.from(orgIds.values())) } });

    return events.map((event) => {
      const organization = organizations.find(
        (org) => org.id == +event.event_organization_id,
      );
      return {
        ...event,
        event_cover_picture_url: this.fileUtilityService.getFileUrl(
          event.event_cover_picture_url,
        ),
        organization: OrganizationSerializer.serialize(
          organization,
          this.fileUtilityService,
        ),
      };
    });
  }
}
