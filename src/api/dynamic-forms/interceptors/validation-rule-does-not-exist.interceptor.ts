import {
  CallHandler,
  ConflictException,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Observable } from 'rxjs';
import { AddValidationRuleDto } from '../dto/update-form/add-validation-rule.dto';
import { ValidationRule } from '../entities/validation-rule.entity';

@Injectable()
export class ValidationRuleDoesNotExistInterceptor implements NestInterceptor {
  constructor(private readonly dataSource: DataSource) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();

    const ruleID = request.params.id;

    await this.dataSource
      .getRepository(ValidationRule)
      .createQueryBuilder('v_rule')
      .where('v_rule.id = :ruleID', { ruleID: ruleID })
      .getExists()
      .then((result) => {
        if (!result) {
          throw new ConflictException(
            'Validation rule does not exists for this field',
          );
        }
      });

    return next.handle();
  }
}
