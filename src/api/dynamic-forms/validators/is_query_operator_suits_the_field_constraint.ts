import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { EntityManager } from 'typeorm';
import { FillFormFieldDto } from '../dto/fill-form-field.dto';
import { QueryFormConditionDto } from '../dto/query-form/query-form-condition.dto';
import { FieldTypeOperators } from '../entities/field-type.operators';
import { FormField } from '../entities/form-field.entity';

@ValidatorConstraint({ name: 'queryOperatorSuitsTheField', async: true })
export class IsQueryOperatorSuitsTheFieldConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly entityManager: EntityManager) {}

  async validate(_value: any, _args: ValidationArguments) {
    const object = _args.object as QueryFormConditionDto;

    const { fieldTypeId } = await this.entityManager
      .getRepository(FormField)
      .createQueryBuilder()
      .where('id = :fID', { fID: object.field_id })
      .getOneOrFail();

    const field_operators = await this.entityManager
      .getRepository(FieldTypeOperators)
      .createQueryBuilder()
      .where('field_type_id = :id', { id: fieldTypeId })
      .getMany();

    const supportedOperators = field_operators.map((fo) => {
      return +fo.query_operator_id;
    });

    return supportedOperators.includes(object.operator_id);
  }

  defaultMessage(_args: ValidationArguments) {
    const object = _args.object as FillFormFieldDto;
    return `${_args.property} provided operator_id does not support the type of the field with id: ${object.field_id}`;
  }
}
