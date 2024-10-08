import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Organization } from '../../organization/entities/organization.entity';
import { Event } from '../../event/entities/event.entity';
import { FilledForm } from './filled-form.entity';
import { FormGroup } from './form-group.entity';

@Entity({ name: 'forms' })
export class Form extends BaseEntity {
  @Column()
  name: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  description: string | null;

  @ManyToOne(() => Organization, (organization) => organization.forms)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @OneToMany(() => Event, (event) => event.form)
  events: Event[];

  @OneToMany(() => FormGroup, (formGroup) => formGroup.form)
  groups: FormGroup[];

  @OneToMany(() => FilledForm, (filledForm) => filledForm.form)
  filledForms: FilledForm[];
}
