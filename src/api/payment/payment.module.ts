import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './services/payment.service';
import { AttendeeModule } from '../attendee/attendee.module';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendeesTickets } from './entities/attendees-tickets.entity';
import { TicketEventType } from './entities/ticket-event-type.entity';
import { PaymentAttendeeService } from './services/payment-attendee.service';
import { PaymentPackagesService } from './services/payment-packages.service';
import { OrganizationsTickets } from './entities/organizations-tickets.entity';
import { PaymentOrganizationService } from './services/payment-organization.service';

@Module({
  imports: [
    UserModule,
    AttendeeModule,
    TypeOrmModule.forFeature([
      AttendeesTickets,
      TicketEventType,
      OrganizationsTickets,
    ]),
  ],
  controllers: [PaymentController],
  providers: [
    PaymentService,
    PaymentAttendeeService,
    PaymentPackagesService,
    PaymentOrganizationService,
  ],
  exports: [PaymentAttendeeService],
})
export class PaymentModule {}
