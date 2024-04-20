import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { EntityManager } from 'typeorm';
import { FillFormFieldDto } from '../dto/fill-form/fill-form-field.dto';
import { QueryFormConditionDto } from '../dto/query-form/query-form-condition.dto';
import { FieldTypeOperatorsEntity } from '../entities/field-type-operators.entity';
import { FormField } from '../entities/form-field.entity';
import { AddOptionDto } from '../dto/update-form/add-option.dto';
import { FieldOption } from '../entities/field-option.entity';
import { UpdateOptionNameDto } from '../dto/update-form/update-option-name.dto';

@ValidatorConstraint({ name: 'IsOptionNameUniqueConstraint', async: true })
export class IsOptionNameUniqueConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly entityManager: EntityManager) {}

  async validate(_value: any, _args: ValidationArguments) {
    const object = _args.object as AddOptionDto & UpdateOptionNameDto;

    const option = this.entityManager
      .getRepository(FieldOption)
      .createQueryBuilder('option')
      .where('option.name = :name', { name: object.name })
      .andWhere('option.deletedAt IS NULL');

    if (object.option_id) {
      const field_id = await this.entityManager
        .getRepository(FieldOption)
        .createQueryBuilder('option')
        .where('option.id = :optionID', { optionID: object.option_id })
        .getOneOrFail()
        .then((option) => option.formFieldId);

      option.andWhere('option.formField = :fieldID', {
        fieldID: field_id,
      });
    } else {
      option.andWhere('option.formField = :fieldID', {
        fieldID: object.field_id,
      });
    }

    const result = await option.getExists();

    return !result;
  }

  defaultMessage(_args: ValidationArguments) {
    const object = _args.object as FillFormFieldDto;
    return `provided option name already exists`;
  }
}
