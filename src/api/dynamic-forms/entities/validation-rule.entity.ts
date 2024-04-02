import { BaseEntity } from '../../../common/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { FormField } from './form-field.entity';
import { ValidationRuleEnum } from '../enums/validation-rule.enum';

@Entity({ name: 'validation_rules' })
@Unique(['rule', 'formField'])
export class ValidationRule extends BaseEntity {
  @Column()
  value: string;

  @Column({
    type: 'enum',
    enum: ValidationRuleEnum,
    nullable: false,
  })
  rule: ValidationRuleEnum;

  @ManyToOne(() => FormField, (formField) => formField.validationRules)
  @JoinColumn({ name: 'form_field_id' })
  formField: FormField;
}
