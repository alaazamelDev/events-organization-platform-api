import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { DataSource } from 'typeorm';

@Injectable()
export class HandlePaymentInEventRegistrationInterceptor
  implements NestInterceptor
{
  constructor(private readonly dataSource: DataSource) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const eventID = request.body.event_id;
    const queryRunner = this.dataSource.createQueryRunner();

    return next.handle();
  }
}
