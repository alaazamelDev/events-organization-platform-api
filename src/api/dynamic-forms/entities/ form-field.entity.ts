import { BaseEntity } from '../../../common/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { FieldType } from './field-type.entity';
import { Option } from './option.entity';
import { Form } from './form.entity';
import { FilledFormField } from './filled-form-field.entity';

@Entity({ name: 'form_fields' })
export class FormField extends BaseEntity {
  @Column()
  name: string;

  @Column()
  label: string;

  @Column()
  required: boolean;

  @Column()
  position: number;

  @ManyToOne(() => FieldType, (fieldType) => fieldType.fields)
  @JoinColumn({ name: 'type_id' })
  fieldType: FieldType;

  @OneToMany(() => Option, (option) => option.formField)
  options: Option[];

  @ManyToOne(() => Form, (form) => form.fields)
  form: Form;

  @OneToMany(
    () => FilledFormField,
    (filledFormField) => filledFormField.formField,
  )
  filledFormFields: FilledFormField[];
}
