import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';
import { ContactOrganization } from './entities/contact_organization.entity';
import { Employee } from '../employee/entities/employee.entity';
import { User } from '../user/entities/user.entity';
import { Permission } from '../permission/entities/permission.entity';
import { Contact } from '../contact/entities/contact.entity';
import { AddressOrganization } from './entities/address_organization.entity';
import { Address } from '../address/entities/address.entity';
import { City } from '../city/entities/city.entity';
import { State } from '../state/entities/state.entity';
import { BlockedAttendee } from './entities/blocked-attendee.entity';
import { EmployeeModule } from '../employee/employee.module';
import { AttendeeModule } from '../attendee/attendee.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Organization,
      ContactOrganization,
      User,
      Employee,
      Permission,
      Contact,
      ContactOrganization,
      Address,
      City,
      State,
      AddressOrganization,
      BlockedAttendee,
    ]),
    EmployeeModule,
    AttendeeModule,
  ],
  controllers: [OrganizationController],
  providers: [OrganizationService],
})
export class OrganizationModule {}
