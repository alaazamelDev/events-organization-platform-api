import { Inject, Injectable } from '@nestjs/common';
import { STRIPE_CLIENT } from '../../stripe/constants/stripe.constants';
import { Stripe } from 'stripe';
import { AttendeesTickets } from '../entities/attendees-tickets.entity';
import { DataSource } from 'typeorm';

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

  async getAttendeeTicketsHistory(attendeeID: number) {
    return this.dataSource
      .getRepository(AttendeesTickets)
      .createQueryBuilder('attendeeTickets')
      .where('attendeeTickets.attendee = :attendeeID', {
        attendeeID: attendeeID,
      })
      .getMany();
  }
}
