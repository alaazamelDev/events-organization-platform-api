import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Organization } from '../../organization/entities/organization.entity';
import { Event } from './event.entity';
import { FormField } from './ form-field.entity';
import { FilledForm } from './filled-form.entity';

@Entity({ name: 'forms' })
export class Form extends BaseEntity {
  @Column()
  name: string;

  @Column()
  description: string;

  @ManyToOne(() => Organization, (organization) => organization.forms)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @OneToMany(() => Event, (event) => event.form)
  events: Event[];

  @OneToMany(() => FormField, (formField) => formField.form)
  fields: FormField[];

  @OneToMany(() => FilledForm, (filledForm) => filledForm.form)
  filledForms: FilledForm[];
}
