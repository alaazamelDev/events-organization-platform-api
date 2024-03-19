import { Injectable, mixin, NestInterceptor, Type } from '@nestjs/common';
import { MulterConfigService } from '../../config/files/multer/config.service';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';

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
        storage: diskStorage({
          destination,
          filename: function (_req, file, cb) {
            const originalFilename = file.originalname; // Get original filename
            const ext = extname(originalFilename); // Extract extension
            const uniqueSuffix =
              Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, file.fieldname + '-' + `${uniqueSuffix}${ext}`);
          },
        }),
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
