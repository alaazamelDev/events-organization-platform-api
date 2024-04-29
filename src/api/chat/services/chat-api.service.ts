import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AttendeeEventStatus } from '../../attend-event/enums/attendee-event-status.enum';
import { Event } from '../../event/entities/event.entity';
import { ChatGroup } from '../entities/chat-group.entity';
import { AttendeeEvent } from '../../attend-event/entities/attendee-event.entity';

/**
 * In this class we will provide the needed endpoint functions
 * to get the needed data in request-response manner
 */
@Injectable()
export class ChatApiService {
  // main data source
  private readonly dataSource: DataSource;

  constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
  }

  async getChattingList(attendeeId: number) {
    const queryBuilder = this.dataSource
      .getRepository(ChatGroup)
      .createQueryBuilder();

    const groupMemberCountSubQuery = queryBuilder
      .subQuery()
      .from(Event, 'ev') // Use distinct alias for events table in the subQuery
      .innerJoin('ev.attendees', 'ae')
      .innerJoin('ev.chatGroup', 'chat_groups')
      .where('ae.status = :status')
      .setParameters({ status: AttendeeEventStatus.accepted })
      .groupBy('ev.id')
      .select(['ev.id as event_id', 'COUNT(*) as group_members']); // Use the alias here

    return await queryBuilder
      .from(ChatGroup, 'cg')
      .innerJoin('cg.event', 'events')
      .innerJoin('events.attendees', 'attendee_event')
      .leftJoin(
        `(${groupMemberCountSubQuery.getQuery()})`,
        'group_counts',
        'group_counts.event_id = events.id',
      )
      .where(
        'attendee_event.id IN ' +
          queryBuilder
            .subQuery()
            .select('attendee_event.id')
            .from(AttendeeEvent, 'attendee_event')
            .where('attendee_event.attendee_id = :attendeeId')
            .andWhere('attendee_event.status = :status')
            .setParameters({
              attendeeId: attendeeId,
              status: AttendeeEventStatus.accepted,
            })
            .getQuery(),
      )
      .andWhere('events.is_chatting_enabled = :isChattingEnabled')
      .setParameters({ isChattingEnabled: true })
      .select([
        'attendee_event.attendee_id AS attendee_id',
        'events.id AS event_id',
        'cg.id AS chat_group_id',
        'cg.group_title AS group_title',
        'COALESCE(group_counts.group_members, 0) AS group_members_count',
        'cg.group_status AS group_status',
      ])
      .distinctOn(['chat_group_id'])
      .getRawMany();
  }
}
