import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/app/config.module';
import { DBConfigModule } from './config/database/postgresql/config.module';
import { PostgresSQLServerDatabaseProviderModule } from './providers/database/postgresql/provider.module';
import { LoggerConfigModule } from './config/logger/sentryio/config.module';
import { SwaggerConfigModule } from './config/openapi/swagger/config.module';
import { HealthController } from './api/health/health.controller';
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

@Module({
  imports: [
    AppConfigModule,
    DBConfigModule,
    PostgresSQLServerDatabaseProviderModule,
    LoggerConfigModule,
    SwaggerConfigModule,
    UserRoleModule,
    UserModule,
    AddressModule,
    AdminModule,
    AttendeeModule,
    CityModule,
    JobModule,
    StateModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
