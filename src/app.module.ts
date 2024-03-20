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
import { MulterConfigModule } from './config/files/multer/config.module';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from './config/files/multer/config.service';
import {
  ServeStaticModule,
  ServeStaticModuleOptions,
} from '@nestjs/serve-static';
import { join } from 'path';
import { FileUtilityModule } from './config/files/utility/file-utility.module';

@Module({
  imports: [
    AppConfigModule,
    DBConfigModule,
    JwtConfigModule,
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
    OrganizationModule,
    EmployeeModule,
    ContactModule,
    PermissionsModule,
    AuthModule,
    MulterConfigModule,
    ServeStaticModule.forRootAsync({
      imports: [MulterConfigModule],
      useFactory: async (multerConfigService: MulterConfigService) =>
        [
          {
            rootPath: join(__dirname, '..', multerConfigService.dest),
          },
        ] as ServeStaticModuleOptions[],
      inject: [MulterConfigService],
    }),
    MulterModule.registerAsync({
      imports: [MulterConfigModule],
      useFactory: async (multerConfigService: MulterConfigService) => ({
        dest: multerConfigService.dest,
        limits: { fileSize: multerConfigService.fileSizeLimit },
        fileFilter: (_req, file, cb) => {
          if (multerConfigService.allowedMimeTypes) {
            if (!multerConfigService.allowedMimeTypes.includes(file.mimetype)) {
              return cb(new Error('Invalid file type'), false);
            }
          }
          cb(null, true);
        },
      }),
      inject: [MulterConfigService],
    }),
    FileUtilityModule,
  ],
  providers: [IsUniqueConstraint, IsExistConstraint],
  controllers: [HealthController],
})
export class AppModule {}
