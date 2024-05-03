import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { STRIPE_CLIENT } from '../../stripe/constants/stripe.constants';
import { Stripe } from 'stripe';
import { UserService } from '../../user/services/user.service';
import { PaymentAttendeeService } from '../services/payment-attendee.service';

@Injectable()
export class CheckoutInterceptor implements NestInterceptor {
  constructor(
    @Inject(STRIPE_CLIENT) private readonly stripe: Stripe,
    private readonly userService: UserService,
    private readonly paymentAttendeeService: PaymentAttendeeService,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    try {
      const request = context.switchToHttp().getRequest();
      const userID = request.user.sub;

      console.log(userID);
      const userEmail = await this.userService.getUserEmailByID(userID);

      console.log(userEmail);
      const stripeCustomer =
        await this.paymentAttendeeService.getAttendeeStripeIdByEmail(userEmail);

      if (!stripeCustomer) {
        const newCustomer = await this.stripe.customers.create({
          email: userEmail,
        });

        request.body.stripe_id = newCustomer.id;
      } else {
        request.body.stripe_id = stripeCustomer.id;
      }
    } catch (e) {
      throw e;
    }

    return next.handle();
  }
}
