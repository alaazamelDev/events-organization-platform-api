import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Form } from './form.entity';
import { FilledForm } from './filled-form.entity';

@Entity({ name: 'events' })
export class Event extends BaseEntity {
  @Column()
  name: string;

  @ManyToOne(() => Form, (form) => form.events)
  @JoinColumn({ name: 'form_id' })
  form: Form;

  @OneToMany(() => FilledForm, (filledForm) => filledForm.event)
  filledForms: FilledForm[];
}
