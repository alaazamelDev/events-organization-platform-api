import { Module } from '@nestjs/common';
import { AttendEventService } from './attend-event.service';
import { AttendEventController } from './attend-event.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendeeEvent } from './entities/attendee-event.entity';
import { Event } from '../event/entities/event.entity';
import { IsEventInRegisterPeriodConstraint } from './validators/is_event_in_register_period_constraint';
import { Attendee } from '../attendee/entities/attendee.entity';
import { ManageAttendEventService } from './manage-attend-event.service';
import { IsEventCapacityCanHoldConstraint } from './validators/is_event_capacity_can_hold_constraint';
import { AttendeesTickets } from '../payment/entities/attendees-tickets.entity';
import { PaymentModule } from '../payment/payment.module';
import { CheckAttendeeBalanceAgainstEventFeesInterceptor } from './interceptors/check-attendee-balance-against-event-fees.interceptor';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AttendeeEvent,
      Event,
      Attendee,
      AttendeesTickets,
    ]),
    PaymentModule,
  ],
  controllers: [AttendEventController],
  providers: [
    AttendEventService,
    ManageAttendEventService,
    IsEventInRegisterPeriodConstraint,
    IsEventCapacityCanHoldConstraint,
  ],
})
export class AttendEventModule {}
