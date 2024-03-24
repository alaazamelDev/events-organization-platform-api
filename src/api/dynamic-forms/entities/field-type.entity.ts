import { BaseEntity } from '../../../common/entities/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { FormField } from './form-field.entity';
import { FieldTypeOperators } from './field-type.operators';

@Entity({ name: 'field_types' })
export class FieldType extends BaseEntity {
  @Column()
  name: string;

  @OneToMany(() => FormField, (formField) => formField.fieldType)
  fields: FormField[];

  @OneToMany(
    () => FieldTypeOperators,
    (fieldTypeOperators) => fieldTypeOperators.field_type,
  )
  fieldTypeOperators: FieldTypeOperators[];
}
