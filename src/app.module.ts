import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/app/config.module';
import { DBConfigModule } from './config/database/postgresql/config.module';
import { PostgresSQLServerDatabaseProviderModule } from './providers/database/postgresql/provider.module';
import { LoggerConfigModule } from './config/logger/sentryio/config.module';
import { SwaggerConfigModule } from './config/openapi/swagger/config.module';
import { HealthController } from './api/health/health.controller';
import { OrganizationModule } from './api/organization/organization.module';
import { EmployeeModule } from './api/employee/employee.module';
import { ContactModule } from './api/contact/contact.module';
import { PermissionsModule } from './api/permission/permissions.module';
import { IsUniqueConstraint } from './common/validators/is_unique_constraint';
import { IsExistConstraint } from './common/validators/is_exist_constraint';
import { AuthModule } from './auth/auth.module';
import {
  AddressModule,
  AdminModule,
  AttendeeModule,
  CityModule,
  JobModule,
  StateModule,
  UserModule,
  UserRoleModule,
} from './api';
import { JwtConfigModule } from './config/secrets/jwt/config.module';

@Module({
  imports: [
    AppConfigModule,
    DBConfigModule,
    // JwtConfigModule,
    PostgresSQLServerDatabaseProviderModule,
    LoggerConfigModule,
    SwaggerConfigModule,
    UserRoleModule,
    UserModule,
    AddressModule,
    AdminModule,
    // AttendeeModule,
    CityModule,
    JobModule,
    StateModule,
    OrganizationModule,
    EmployeeModule,
    ContactModule,
    PermissionsModule,
    // AuthModule,
  ],
  providers: [IsUniqueConstraint, IsExistConstraint],
  controllers: [HealthController],
})
export class AppModule {}
