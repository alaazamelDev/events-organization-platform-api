import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { AppConfigService } from './config/app/config.service';
import { SwaggerConfigModule } from './config/openapi/swagger/config.module';
import { SwaggerConfigService } from './config/openapi/swagger/config.service';
import { ResponseInterceptor } from './common/interceptors/response/response.interceptor';
import { useContainer } from 'class-validator';
import { TimeoutInterceptor } from './common/interceptors/timeout/timeout.interceptor';
import * as moment from 'moment-timezone';

const logger = new Logger('MAIN');

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { rawBody: true });

  const appConfig: AppConfigService = app.get(AppConfigService);
  // const sentryConfig: LoggerConfigService = app.get(LoggerConfigService);
  const swaggerConfig: SwaggerConfigService = app.get(SwaggerConfigService);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.use(helmet({ crossOriginResourcePolicy: false }));
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalInterceptors(new TimeoutInterceptor());

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  });

  // Get the time zone from environment variables
  const timeZone = process.env.TZ || 'UTC';

  // Set the default time zone globally
  moment.tz.setDefault(timeZone);

  // Sentry.init({
  //   dsn: sentryConfig.dns,
  //   enabled: sentryConfig.enable,
  //   release: sentryConfig.release,
  //   environment: appConfig.env,
  // });

  if (appConfig.env == 'development') {
    const swagger: SwaggerConfigModule = new SwaggerConfigModule(swaggerConfig);
    swagger.setup(app);
  }

  await app.listen(appConfig.port);
}

bootstrap()
  .then(() => {
    logger.log('DONE');
  })
  .catch(() => new Error('Something fail loading the app'));
