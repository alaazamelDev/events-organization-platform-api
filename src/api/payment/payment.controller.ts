import {
  Controller,
  Get,
  Inject,
  Post,
  RawBodyRequest,
  Req,
  Res,
  Headers,
  BadRequestException,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { STRIPE_CLIENT } from '../stripe/constants/stripe.constants';
import { Stripe } from 'stripe';
import { Response } from 'express';

@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    @Inject(STRIPE_CLIENT) private readonly stripe: Stripe,
  ) {}

  @Post('webhook')
  async stripeEvents(
    @Headers('stripe-signature') signature: string,
    @Req() req: RawBodyRequest<Request>,
    @Res() res: Response,
  ) {
    try {
      const ws =
        'whsec_cc93fc5e334d04df1b259c66ed98ec6d32425ec8bf0dd888ff1a7033673e12fb';
      const event = this.stripe.webhooks.constructEvent(
        req.rawBody ? req.rawBody : '',
        signature,
        ws,
      );

      switch (event.type) {
        case 'checkout.session.completed':
          const sessionWithLineItems =
            await this.stripe.checkout.sessions.retrieve(event.data.object.id, {
              expand: ['line_items'],
            });
          // console.log(sessionWithLineItems);
          console.log(sessionWithLineItems.line_items?.data);
          break;
        default:
        // console.log('unsupported event type');
      }

      res.status(200).end();
    } catch (e) {
      throw new BadRequestException(`Webhook Error`);
    }
  }

  @Post('checkout')
  checkout() {
    return this.paymentService.checkout();
  }

  @Get('products')
  getProducts() {
    return this.paymentService.getProducts();
  }

  @Get('success/checkout/session')
  success(@Res({ passthrough: true }) res: any) {
    // console.log('res', res);
    console.log(res.req.query.session_id);
  }
}
