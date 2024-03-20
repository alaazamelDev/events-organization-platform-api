import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Attendee } from './attendee.entity';
import { Contact } from '../../contact/entities/contact.entity';

@Entity('attendee_contact')
export class AttendeeContact extends BaseEntity {
  @ManyToOne(() => Attendee)
  @JoinColumn({ name: 'attendee_id' })
  attendee: Attendee;

  @ManyToOne(() => Contact, { eager: true })
  @JoinColumn({ name: 'contact_id' })
  contact: Contact;

  @Column({
    name: 'content',
    type: 'varchar',
    nullable: false,
  })
  content!: string;
}
