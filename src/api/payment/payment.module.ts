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
import { EmployeeModule } from '../employee/employee.module';
import { OrganizationWithdraw } from './entities/organization-withdraw.entity';
import { ManageWithdrawStatusConstraint } from './validators/manage_withdraw_status_constraint';
import { DoesOrganizationBalanceCoverTheWithdrawConstraint } from './validators/does_organization_balance_cover_the_withdraw_constraint';

@Module({
  imports: [
    EmployeeModule,
    UserModule,
    AttendeeModule,
    TypeOrmModule.forFeature([
      AttendeesTickets,
      TicketEventType,
      OrganizationsTickets,
      OrganizationWithdraw,
    ]),
  ],
  controllers: [PaymentController],
  providers: [
    PaymentService,
    PaymentAttendeeService,
    PaymentPackagesService,
    PaymentOrganizationService,
    ManageWithdrawStatusConstraint,
    DoesOrganizationBalanceCoverTheWithdrawConstraint,
  ],
  exports: [PaymentAttendeeService],
})
export class PaymentModule {}
