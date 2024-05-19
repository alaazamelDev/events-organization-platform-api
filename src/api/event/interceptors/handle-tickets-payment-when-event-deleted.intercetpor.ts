import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { QueryRunner } from 'typeorm';
import { AttendeesTickets } from '../../payment/entities/attendees-tickets.entity';
import { OrganizationsTickets } from '../../payment/entities/organizations-tickets.entity';

@Injectable()
export class HandleTicketsPaymentWhenEventDeletedInterceptor
  implements NestInterceptor
{
  constructor() {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const event_id = request.params.id;
    const queryRunner: QueryRunner = request.queryRunner;

    await queryRunner.manager
      .createQueryBuilder()
      .delete()
      .from(AttendeesTickets)
      .where("data::jsonb ->> 'event_id' = :eventId", {
        eventId: event_id,
      })
      .execute();

    await queryRunner.manager
      .createQueryBuilder()
      .delete()
      .from(OrganizationsTickets)
      .where("data::jsonb ->> 'event_id' = :eventId", {
        eventId: event_id,
      })
      .execute();

    return next.handle();
  }
}
