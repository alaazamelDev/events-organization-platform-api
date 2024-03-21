import { BaseEntity } from '../../../common/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { FilledForm } from './filled-form.entity';
import { FormField } from './ form-field.entity';
import { Option } from './option.entity';

@Entity({ name: 'filled_form_fields' })
export class FilledFormField extends BaseEntity {
  @Column()
  value: string;

  @ManyToOne(() => FilledForm, (filledForm) => filledForm.filledFormFields)
  @JoinColumn({ name: 'filled_form_id' })
  filledForm: FilledForm;

  @ManyToOne(() => FormField)
  @JoinColumn({ name: 'form_field_id' })
  formField: FormField;

  @ManyToOne(() => Option)
  @JoinColumn({ name: 'option_id' })
  option: Option;
}
