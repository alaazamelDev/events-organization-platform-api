import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './services/payment.service';
import { AttendeeModule } from '../attendee/attendee.module';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendeesTickets } from './entities/attendees.tickets';
import { TicketEventType } from './entities/ticket-event-type.entity';
import { PaymentAttendeeService } from './services/payment-attendee.service';

@Module({
  imports: [
    UserModule,
    AttendeeModule,
    TypeOrmModule.forFeature([AttendeesTickets, TicketEventType]),
  ],
  controllers: [PaymentController],
  providers: [PaymentService, PaymentAttendeeService],
})
export class PaymentModule {}
