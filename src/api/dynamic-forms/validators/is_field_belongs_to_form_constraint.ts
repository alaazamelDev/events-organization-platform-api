import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { FillFormDto } from '../dto/fill-form/fill-form.dto';
import { EntityManager } from 'typeorm';
import { FormField } from '../entities/form-field.entity';

@ValidatorConstraint({ name: 'fieldBelongToForm', async: true })
export class IsFieldBelongsToForm implements ValidatorConstraintInterface {
  constructor(private readonly entityManager: EntityManager) {}

  async validate(_text: any, _args: ValidationArguments) {
    const object = _args.object as FillFormDto;
    const form_id = object.form_id;

    const result = await Promise.all(
      object.fields.map(async (field) => {
        return await this.entityManager
          .getRepository(FormField)
          .createQueryBuilder('field')
          .leftJoinAndSelect('field.group', 'group')
          .leftJoinAndSelect('group.form', 'form')
          .where('field.id = :id', { id: field.field_id })
          .andWhere('form.id = :formId', { formId: form_id })
          .getExists();
      }),
    );

    return !result.includes(false);
  }

  defaultMessage(_args: ValidationArguments) {
    return 'provided field does not belong to the specified form';
  }
}
