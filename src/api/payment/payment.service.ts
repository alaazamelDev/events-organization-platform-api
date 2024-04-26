import { Inject, Injectable } from '@nestjs/common';
import { STRIPE_CLIENT } from '../stripe/constants/stripe.constants';
import { Stripe } from 'stripe';

@Injectable()
export class PaymentService {
  constructor(@Inject(STRIPE_CLIENT) private readonly stripe: Stripe) {}

  async getProducts() {
    return this.stripe.products.list().then((products) => products.data);
  }

  async checkout() {
    const session = await this.stripe.checkout.sessions.create({
      line_items: [{ price: 'price_1P8luo09QlCNuz5u2EHADNwK', quantity: 1 }],
      customer: 'cus_PzTw6nVMPpyl2t',
      mode: 'payment',
      payment_intent_data: {
        setup_future_usage: 'on_session',
      },
      success_url:
        'http://localhost:9000/api/payment/success/checkout/session?session_id={CHECKOUT_SESSION_ID}',
    });

    return session;
  }

  private async getCustomerStripeIdByEmail(email: string) {
    return await this.stripe.customers
      .list({ email: email })
      .then((object) => object.data[0]);
  }
}
