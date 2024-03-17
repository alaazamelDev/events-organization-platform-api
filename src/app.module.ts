import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/app/config.module';
import { DBConfigModule } from './config/database/postgresql/config.module';
import { PostgresSQLServerDatabaseProviderModule } from './providers/database/postgresql/provider.module';
import { LoggerConfigModule } from './config/logger/sentryio/config.module';
import { SwaggerConfigModule } from './config/openapi/swagger/config.module';
import { HealthController } from './api/health/health.controller';
import { UserRoleModule } from './api/userRole/user_role.module';
import { UserModule } from "./api/user/user.module";
import { OrganizationModule } from './api/organization/organization.module';
import { EmployeeModule } from './api/employee/employee.module';
import { ContactModule } from './api/contact/contact.module';
import { PermissionsModule } from './api/permission/permissions.module';

@Module({
  imports: [
    AppConfigModule,
    DBConfigModule,
    PostgresSQLServerDatabaseProviderModule,
    LoggerConfigModule,
    SwaggerConfigModule,
    UserRoleModule,
    UserModule,
    OrganizationModule,
    EmployeeModule,
    ContactModule,
    PermissionsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
