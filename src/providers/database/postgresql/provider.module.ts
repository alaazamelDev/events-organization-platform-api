import { DatabaseType } from 'typeorm';
import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { DBConfigModule } from '../../../config/database/postgresql/config.module';
import { DBConfigService } from '../../../config/database/postgresql/config.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [DBConfigModule],
      useFactory: async (
        dbConfigService: DBConfigService,
        // eslint-disable-next-line @typescript-eslint/require-await
      ) => ({
        type: 'postgres' as DatabaseType,
        host: dbConfigService.host,
        port: dbConfigService.port,
        username: dbConfigService.user,
        password: dbConfigService.password,
        database: dbConfigService.database,
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [DBConfigService],
    } as TypeOrmModuleAsyncOptions),
  ],
})
export class PostgresSQLServerDatabaseProviderModule {}
