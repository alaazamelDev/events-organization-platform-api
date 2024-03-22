import { Injectable, mixin, NestInterceptor, Type } from '@nestjs/common';
import { MulterConfigService } from '../../config/files/multer/config.service';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorageGenerator } from '../../config/files/disk-storage.generator';

interface LocalFileInterceptorOptions {
  fieldName: string;
  path?: string;
}

export function LocalFileInterceptor(
  options: LocalFileInterceptorOptions,
): Type<NestInterceptor> {
  @Injectable()
  class Interceptor implements NestInterceptor {
    fileInterceptor: NestInterceptor;

    constructor(multerConfigService: MulterConfigService) {
      const filesDestination = multerConfigService.dest;

      const destination = `${filesDestination}${options.path}`;

      const multerOptions: MulterOptions = {
        storage: diskStorageGenerator(destination),
      };

      this.fileInterceptor = new (FileInterceptor(
        options.fieldName,
        multerOptions,
      ))();
    }

    intercept(...args: Parameters<NestInterceptor['intercept']>) {
      return this.fileInterceptor.intercept(...args);
    }
  }

  return mixin(Interceptor);
}
