import { BaseEntity } from '../../../common/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { FormField } from './form-field.entity';
import { FilledFormField } from './filled-form-field.entity';

@Entity({ name: 'field_options' })
export class FieldOption extends BaseEntity {
  @Column()
  name: string;

  @Column({ name: 'form_field_id' })
  formFieldId: number;

  @ManyToOne(() => FormField, (formField) => formField.options)
  @JoinColumn({ name: 'form_field_id' })
  formField: FormField;

  @OneToMany(() => FilledFormField, (filledFormField) => filledFormField.option)
  filledFormFields: FilledFormField[];

  constructor(partial: Partial<FieldOption>) {
    super();
    Object.assign(this, partial);
  }
}
