import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { FillFormDto } from '../dto/fill-form.dto';
import { EntityManager } from 'typeorm';
import { FormField } from '../entities/ form-field.entity';
import { FillFormFieldDto } from '../dto/fill-form-field.dto';
import { FIELD_TYPE } from '../dto/create-form-field.dto';
import { Form } from '../entities/form.entity';

@ValidatorConstraint({ name: 'requiredFieldsProvided', async: true })
export class AreRequiredFieldsProvidedConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly entityManager: EntityManager) {}

  async validate(_value: any, _args: ValidationArguments) {
    const object = _args.object as FillFormDto;
    const form = await this.entityManager
      .getRepository(Form)
      .createQueryBuilder('form')
      .leftJoinAndSelect('form.fields', 'field')
      .where('form.id = :id', { id: object.form_id })
      .andWhere('field.required = :req', { req: true })
      .getOneOrFail();

    const fieldIds = object.fields.map((field) => {
      return field.field_id;
    });

    let result = true;
    form.fields.map((field) => {
      if (!fieldIds.includes(+field.id)) {
        result = false;
      }
    });

    return result;
  }

  defaultMessage(_args: ValidationArguments) {
    const object = _args.object as FillFormFieldDto;
    return `the provided fields does not cover all the required fields`;
  }
}
