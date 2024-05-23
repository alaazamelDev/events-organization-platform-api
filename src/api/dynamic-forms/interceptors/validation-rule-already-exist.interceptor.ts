import {
  CallHandler,
  ConflictException,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { DataSource } from 'typeorm';
import { AddValidationRuleDto } from '../dto/update-form/add-validation-rule.dto';
import { ValidationRule } from '../entities/validation-rule.entity';

@Injectable()
export class ValidationRuleAlreadyExistInterceptor implements NestInterceptor {
  constructor(private readonly dataSource: DataSource) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();

    const body = request.body as AddValidationRuleDto;

    await this.dataSource
      .getRepository(ValidationRule)
      .createQueryBuilder('v_rule')
      .where('v_rule.formField = :filedID', { filedID: body.field_id })
      .andWhere('v_rule.rule = :ruleType', { ruleType: body.rule })
      .getExists()
      .then((result) => {
        if (result) {
          throw new ConflictException(
            'Validation rule already exists for this field',
          );
        }
      });

    return next.handle();
  }
}
