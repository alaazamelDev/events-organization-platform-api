import { BaseEntity } from '../../../common/entities/base.entity';
import { Entity, JoinColumn, ManyToOne, OneToMany, Unique } from 'typeorm';
import { Attendee } from '../../attendee/entities/attendee.entity';
import { Form } from './form.entity';
import { Event } from '../../event/entities/event.entity';
import { FilledFormField } from './filled-form-field.entity';

@Entity({ name: 'filled_forms' })
@Unique(['event', 'attendee'])
export class FilledForm extends BaseEntity {
  @ManyToOne(() => Attendee, (attende) => attende.filledForms)
  @JoinColumn({ name: 'attendee_id' })
  attendee: Attendee;

  @ManyToOne(() => Form, (form) => form.filledForms)
  @JoinColumn({ name: 'form_id' })
  form: Form;

  @ManyToOne(() => Event, (event) => event.filledForms)
  @JoinColumn({ name: 'event_id' })
  event: Event;

  @OneToMany(
    () => FilledFormField,
    (filledFormField) => filledFormField.filledForm,
  )
  filledFormFields: FilledFormField[];
}
