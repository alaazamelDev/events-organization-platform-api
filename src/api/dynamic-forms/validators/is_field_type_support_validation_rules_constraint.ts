import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { EntityManager } from 'typeorm';
import { FormField } from '../entities/form-field.entity';
import { FillFormFieldDto } from '../dto/fill-form/fill-form-field.dto';
import { fieldTypesWithValidationRules } from '../constants/constants';
import { AddValidationRuleDto } from '../dto/update-form/add-validation-rule.dto';

@ValidatorConstraint({
  name: 'IsFieldTypeSupportValidationRulesConstraint',
  async: true,
})
export class IsFieldTypeSupportValidationRulesConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly entityManager: EntityManager) {}

  async validate(_value: any, _args: ValidationArguments) {
    const object = _args.object as AddValidationRuleDto;

    const { fieldTypeId } = await this.entityManager
      .getRepository(FormField)
      .createQueryBuilder('field')
      .where('field.id = :id', { id: +object.field_id })
      .getOneOrFail();

    return fieldTypesWithValidationRules.includes(+fieldTypeId);
  }

  defaultMessage(_args: ValidationArguments) {
    return `field does not support adding validation rules`;
  }
}
