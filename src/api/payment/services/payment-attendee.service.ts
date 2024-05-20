import { Inject, Injectable } from '@nestjs/common';
import { STRIPE_CLIENT } from '../../stripe/constants/stripe.constants';
import { Stripe } from 'stripe';
import { AttendeesTickets } from '../entities/attendees-tickets.entity';
import { DataSource } from 'typeorm';
import { DidAttendeePayedForTheEventDto } from '../dto/did-attendee-payed-for-the-event.dto';
import { TicketsEventTypes } from '../constants/tickets-event-types.constant';
import { Event } from '../../event/entities/event.entity';
import { AttendeeTicketsHistorySerializer } from '../serializers/attendee-tickets-history.serializer';

@Injectable()
export class PaymentAttendeeService {
  constructor(
    @Inject(STRIPE_CLIENT)
    private readonly stripe: Stripe,
    private readonly dataSource: DataSource,
  ) {}

  async getAttendeeStripeIdByEmail(email: string) {
    return await this.stripe.customers
      .list({ email: email })
      .then((object) => object.data[0]);
  }

  async getAttendeeTicketsBalance(attendeeID: number) {
    return (
      (await this.dataSource
        .getRepository(AttendeesTickets)
        .createQueryBuilder('attendeeTickets')
        .select([])
        .where('attendeeTickets.attendee = :attendeeID', {
          attendeeID: attendeeID,
        })
        .groupBy('attendeeTickets.attendee')
        .addSelect('SUM(attendeeTickets.value)', 'balance')
        .getRawOne()) || { balance: '0' }
    );
  }

  async getAttendeeTicketsHistory(attendeeID: number): Promise<any> {
    const result = await this.dataSource
      .getRepository(AttendeesTickets)
      .createQueryBuilder('attendee_tickets')
      .where('attendee_tickets.attendee = :attendeeID', {
        attendeeID: attendeeID,
      })
      .leftJoinAndSelect(
        Event,
        'event',
        `event.id = CAST(JSONB_EXTRACT_PATH_TEXT(attendee_tickets.data, 'event_id') AS BIGINT)`,
      )
      .getRawMany();

    return AttendeeTicketsHistorySerializer.serializeList(result);
  }

  async didAttendeePayedForTheEvent(dto: DidAttendeePayedForTheEventDto) {
    return await this.dataSource
      .getRepository(AttendeesTickets)
      .createQueryBuilder('attendeeTickets')
      .leftJoinAndSelect('attendeeTickets.event', 'event')
      .where('attendeeTickets.attendee = :attendeeID', {
        attendeeID: dto.attendee_id,
      })
      .andWhere(
        `attendeeTickets.data ::jsonb @> \'{"event_id":"${dto.event_id}"}\'`,
      )
      .orderBy('attendeeTickets.createdAt', 'DESC')
      .limit(1)
      .getOne()
      .then((obj) =>
        !obj ? false : +obj.event.id === +TicketsEventTypes.CONSUME,
      );
  }

  async getTicketsUsage() {
    return await this.dataSource
      .getRepository(AttendeesTickets)
      .createQueryBuilder('tickets')
      .where(`jsonb_exists(tickets.data, 'event_id')`)
      .andWhere('tickets.event = :eventID', {
        eventID: TicketsEventTypes.CONSUME,
      })
      .leftJoinAndSelect('tickets.attendee', 'attendee')
      .leftJoin('attendee.user', 'user')
      .addSelect(['user.id', 'user.username', 'user.email'])
      .leftJoinAndSelect(
        Event,
        'event',
        `event.id = CAST(JSONB_EXTRACT_PATH_TEXT(tickets.data, 'event_id') AS BIGINT)`,
      )
      .leftJoinAndSelect('event.organization', 'organization')
      .getRawMany();
  }
}
