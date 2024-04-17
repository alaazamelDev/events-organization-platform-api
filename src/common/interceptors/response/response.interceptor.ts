import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';
import * as process from 'process';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((res: unknown) => this.responseHandler(res, context)),
      catchError((err: HttpException) =>
        throwError(() => this.errorHandler(err, context)),
      ),
    );
  }

  errorHandler(exception: any, context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const exc = this.handleException(exception);

    const status =
      exc instanceof HttpException
        ? exc.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json({
      status: false,
      statusCode: status,
      path: request.url,
      message: exc.message,
      result: exc,
    });
  }

  responseHandler(res: any, context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const statusCode = response.statusCode;

    return {
      status: true,
      path: request.url,
      statusCode,
      result: res,
    };
  }

  private handleException(exception: any) {
    if (exception instanceof QueryFailedError) {
      const exc = exception as any;
      if (exc.code === '23505') {
        const messageStart = exc.table.split('_').join(' ') + ' with';

        return new BadRequestException([
          exc.detail.replace('Key', messageStart),
        ]);
      }

      return exception;
    } else if (exception instanceof EntityNotFoundError) {
      return new BadRequestException(['The provided id was not found']);
    }

    return exception;
  }
}
