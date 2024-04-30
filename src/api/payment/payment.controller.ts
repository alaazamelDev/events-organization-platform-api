import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  Inject,
  Param,
  Post,
  RawBodyRequest,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PaymentService } from './services/payment.service';
import { STRIPE_CLIENT } from '../stripe/constants/stripe.constants';
import { Stripe } from 'stripe';
import { Request, Response } from 'express';
import { CheckoutDto } from './dto/checkout.dto';
import { AccessTokenGuard } from '../../auth/guards/access-token.guard';
import { RoleGuard } from '../../common/guards/role/role.guard';
import { UserRoleEnum } from '../userRole/enums/user-role.enum';
import { Roles } from '../../common/decorators/roles.decorator';
import { CheckoutInterceptor } from './interceptors/checkout.interceptor';
import { PaymentAttendeeService } from './services/payment-attendee.service';
import * as process from 'process';

@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly paymentAttendeeService: PaymentAttendeeService,
    @Inject(STRIPE_CLIENT)
    private readonly stripe: Stripe,
  ) {}

  @Post('stripe/webhook')
  async stripeEvents(
    @Headers('stripe-signature') signature: string,
    @Req() req: RawBodyRequest<Request>,
    @Res() res: Response,
  ) {
    try {
      const local_ws =
        'whsec_cc93fc5e334d04df1b259c66ed98ec6d32425ec8bf0dd888ff1a7033673e12fb';

      const event = this.stripe.webhooks.constructEvent(
        req.rawBody ? req.rawBody : '',
        signature,
        process.env.STRIPE_WEBHOOK_KEY
          ? process.env.STRIPE_WEBHOOK_KEY
          : local_ws,
      );

      switch (event.type) {
        case 'checkout.session.completed':
          const sessionWithLineItems =
            await this.stripe.checkout.sessions.retrieve(event.data.object.id, {
              expand: ['line_items', 'line_items.data.price.product'],
            });

          const email = sessionWithLineItems.customer_details?.email;
          const items = sessionWithLineItems.line_items?.data;
          await this.paymentService.fulfillTicketsOrder(
            email ? email : '',
            items ? items : [],
          );
          break;
        default:
          console.log('unsupported event type');
      }

      res.status(200).end();
    } catch (e) {
      res.status(400).end();
      throw new BadRequestException(`Webhook Error`);
    }
  }

  @Post('checkout')
  @Roles(UserRoleEnum.ATTENDEE)
  @UseGuards(AccessTokenGuard, RoleGuard)
  @UseInterceptors(CheckoutInterceptor)
  checkout(@Body() checkoutDto: CheckoutDto) {
    return this.paymentService.checkout(checkoutDto);
  }

  @Get('products')
  getProducts() {
    return this.paymentService.getProducts();
  }

  @Get('attendee/balance/:id')
  getAttendeeTicketsBalance(@Param('id') id: string) {
    return this.paymentAttendeeService.getAttendeeTicketsBalance(+id);
  }
}
