import { BaseEntity } from '../../../common/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { FormField } from './ form-field.entity';
import { FilledFormField } from './filled-form-field.entity';

@Entity({ name: 'options' })
export class Option extends BaseEntity {
  @Column()
  name: string;

  @ManyToOne(() => FormField, (formField) => formField.options)
  @JoinColumn({ name: 'form_field_id' })
  formField: FormField;

  @OneToMany(() => FilledFormField, (filledFormField) => filledFormField.option)
  filledFormFields: FilledFormField[];
}
