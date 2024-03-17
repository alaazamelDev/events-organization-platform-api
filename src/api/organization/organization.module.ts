import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Organization } from "./entities/organization.entity";
import { ContactOrganization } from "./entities/contact_organization.entity";
import { Employee } from "../employee/entities/employee.entity";
import { User } from "../user/entities/user.entity";
import { Permission } from "../permission/entities/permission.entity";
import { Contact } from "../contact/entities/contact.entity";

@Module({
  imports: [TypeOrmModule.forFeature([
    Organization,
    ContactOrganization,
    User,
    Employee,
    Permission,
    Contact,
    ContactOrganization,
  ])],
  controllers: [OrganizationController],
  providers: [
    OrganizationService,
  ],
})
export class OrganizationModule {}
