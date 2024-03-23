import { BaseEntity } from '../../../common/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { FieldType } from './field-type.entity';
import { FieldOption } from './field-option.entity';
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

  @Column({ name: 'type_id' })
  fieldTypeId: number;

  @ManyToOne(() => FieldType, (fieldType) => fieldType.fields)
  @JoinColumn({ name: 'type_id' })
  fieldType: FieldType;

  @OneToMany(() => FieldOption, (option) => option.formField)
  options: FieldOption[];

  @ManyToOne(() => Form, (form) => form.fields)
  @JoinColumn({ name: 'form_id' })
  form: Form;

  @OneToMany(
    () => FilledFormField,
    (filledFormField) => filledFormField.formField,
  )
  filledFormFields: FilledFormField[];
}
