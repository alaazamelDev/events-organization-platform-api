import { BaseEntity } from '../../../common/entities/base.entity';
import { Column, JoinColumn, ManyToOne } from 'typeorm';
import { FormField } from './form-field.entity';

export class ValidationRule extends BaseEntity {
  @Column()
  value: string;

  @ManyToOne(() => FormField, (formField) => formField.validationRules)
  @JoinColumn({ name: 'form_field_id' })
  formField: FormField;
}
