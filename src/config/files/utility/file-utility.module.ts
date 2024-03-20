import { Module } from '@nestjs/common';
import { FileUtilityService } from './file-utility.service';
import { AppConfigService } from '../../app/config.service';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [FileUtilityService, AppConfigService, ConfigService],
  exports: [FileUtilityService],
})
export class FileUtilityModule {}
