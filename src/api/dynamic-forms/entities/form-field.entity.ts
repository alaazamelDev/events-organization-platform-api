import { BaseEntity } from '../../../common/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { FieldType } from './field-type.entity';
import { FieldOption } from './field-option.entity';
import { FilledFormField } from './filled-form-field.entity';
import { FormGroup } from './form-group.entity';
import { ValidationRule } from './validation-rule.entity';

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

  @ManyToOne(() => FormGroup, (formGroup) => formGroup.fields)
  @JoinColumn({ name: 'group_id' })
  group: FormGroup;

  @OneToMany(
    () => FilledFormField,
    (filledFormField) => filledFormField.formField,
  )
  filledFormFields: FilledFormField[];

  @OneToMany(() => ValidationRule, (validationRule) => validationRule.formField)
  validationRules: ValidationRule[];
}
