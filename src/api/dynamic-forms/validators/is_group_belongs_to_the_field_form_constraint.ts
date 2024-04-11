import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { EntityManager } from 'typeorm';
import { FillFormFieldDto } from '../dto/fill-form/fill-form-field.dto';
import { FieldOption } from '../entities/field-option.entity';
import { CreateFormFieldDto } from '../dto/create-form/create-form-field.dto';
import { UpdateFormFieldDto } from '../dto/update-form/update-form-field.dto';
import { FormField } from '../entities/form-field.entity';
import { FormGroup } from '../entities/form-group.entity';

@ValidatorConstraint({
  name: 'IsGroupBelongsToTheFieldFormConstraint',
  async: true,
})
export class IsGroupBelongsToTheFieldFormConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly entityManager: EntityManager) {}

  async validate(_value: any, _args: ValidationArguments) {
    const object = _args.object as UpdateFormFieldDto;

    const field_form_id = await this.entityManager
      .getRepository(FormField)
      .createQueryBuilder('field')
      .where('field.id = :fieldID', { fieldID: object.field_id })
      .leftJoinAndSelect('field.group', 'group')
      .leftJoinAndSelect('group.form', 'from')
      .getOneOrFail()
      .then((row) => row.group.form.id);

    const group_form_id = await this.entityManager
      .getRepository(FormGroup)
      .createQueryBuilder('group')
      .where('group.id = :groupID', { groupID: object.group_id })
      .leftJoinAndSelect('group.form', 'form')
      .getOneOrFail()
      .then((row) => row.form.id);

    console.log(field_form_id);
    console.log(group_form_id);

    return +field_form_id === +group_form_id;
  }

  defaultMessage(_args: ValidationArguments) {
    const object = _args.object as FillFormFieldDto;
    return `provided group_id does not belong to the same form as the field with id: ${object.field_id}`;
  }
}
