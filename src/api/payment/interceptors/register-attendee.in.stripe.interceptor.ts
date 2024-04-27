import {
  CallHandler,
  ExecutionContext,
  Inject,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { STRIPE_CLIENT } from '../../stripe/constants/stripe.constants';
import { Stripe } from 'stripe';

export class RegisterAttendeeInStripeInterceptor implements NestInterceptor {
  constructor(@Inject(STRIPE_CLIENT) private readonly stripe: Stripe) {}

  intercept(
    _context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      tap(async (data) => {
        try {
          await this.stripe.customers.create({ email: data.email });
        } catch (e) {
          console.log(e);
        }
      }),
      catchError((err) => throwError(() => err)),
    );
  }
}
