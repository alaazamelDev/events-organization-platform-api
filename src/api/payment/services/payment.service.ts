import { Inject, Injectable } from '@nestjs/common';
import { STRIPE_CLIENT } from '../../stripe/constants/stripe.constants';
import { Stripe } from 'stripe';
import { CheckoutDto } from '../dto/checkout.dto';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { Attendee } from '../../attendee/entities/attendee.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AttendeesTickets } from '../entities/attendees-tickets.entity';
import { TicketsEventTypes } from '../constants/tickets-event-types.constant';
import { AttendeeService } from '../../attendee/services/attendee.service';

@Injectable()
export class PaymentService {
  constructor(
    @Inject(STRIPE_CLIENT)
    private readonly stripe: Stripe,
    @InjectRepository(AttendeesTickets)
    private readonly attendeeTickets: Repository<AttendeesTickets>,
    private readonly dataSource: DataSource,
    private readonly attendeeService: AttendeeService,
  ) {}

  async checkout(checkoutDto: CheckoutDto) {
    return await this.stripe.checkout.sessions.create({
      line_items: [
        { price: checkoutDto.price_id, quantity: checkoutDto.quantity },
      ],
      customer: checkoutDto.stripe_id,
      mode: 'payment',
      payment_intent_data: {
        setup_future_usage: 'on_session',
      },
      success_url:
        'https://5th-year-graduation-project-web-attendee.vercel.app/payment/success',
    });
  }

  async fulfillTicketsOrder(email: string, items: Stripe.LineItem[]) {
    const attendee = await this.attendeeService.getAttendeeIdByEmail(email);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await Promise.all(
        items.map(async (item) =>
          this.fulfillLineItem(item, attendee, queryRunner),
        ),
      );

      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  private async fulfillLineItem(
    item: Stripe.LineItem,
    attendee: Attendee,
    queryRunner: QueryRunner,
  ) {
    const product = item.price?.product as Stripe.Product;
    const quantity = item.quantity;
    const value = product.metadata.value;

    const ticket = this.attendeeTickets.create({
      value: Number(quantity) * Number(value),
      attendee: attendee,
      data: { product: product.id },
      event: { id: TicketsEventTypes.BUY },
    });

    await queryRunner.manager.save(ticket);
  }
}
