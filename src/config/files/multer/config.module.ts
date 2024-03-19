import * as Joi from 'joi';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './configuration';
import { MulterConfigService } from './config.service';
import { getEnvironmentPath } from 'src/common/helpers/environment.helper';
import { ENVIRONMENT_PATH } from 'src/common/constants/constants';

const envFilePath: string = getEnvironmentPath(ENVIRONMENT_PATH);

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath,
      load: [configuration],
      validationSchema: Joi.object({
        FILE_UPLOAD_DEST: Joi.string(),
        ALLOWED_MIME_TYPES: Joi.string(),
        FILE_SIZE_LIMIT: Joi.number().default(2097152),
      }),
    }),
  ],
  providers: [ConfigService, MulterConfigService],
  exports: [ConfigService, MulterConfigService],
})
export class MulterConfigModule {}
