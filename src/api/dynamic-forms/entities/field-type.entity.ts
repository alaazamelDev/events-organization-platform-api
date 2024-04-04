import { BaseEntity } from '../../../common/entities/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { FormField } from './form-field.entity';
import { FieldTypeOperatorsEntity } from './field-type-operators.entity';

@Entity({ name: 'field_types' })
export class FieldType extends BaseEntity {
  @Column()
  name: string;

  @OneToMany(() => FormField, (formField) => formField.fieldType)
  fields: FormField[];

  @OneToMany(
    () => FieldTypeOperatorsEntity,
    (fieldTypeOperators) => fieldTypeOperators.field_type,
  )
  fieldTypeOperators: FieldTypeOperatorsEntity[];
}
