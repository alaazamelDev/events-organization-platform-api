import { Form } from './form.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { FormField } from './form-field.entity';

@Entity({ name: 'form_groups' })
export class FormGroup extends BaseEntity {
  @Column()
  name: string;

  @Column()
  position: number;

  @ManyToOne(() => Form, (form) => form.groups)
  @JoinColumn({ name: 'form_id' })
  form: Form;

  @OneToMany(() => FormField, (formField) => formField.group)
  fields: FormField[];
}
