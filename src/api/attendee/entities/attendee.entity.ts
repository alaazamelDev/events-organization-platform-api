import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../user/entities/user.entity';
import { Address } from '../../address/entities/address.entity';
import { Job } from '../../job/entities/job.entity';
import { AttendeeContact } from './attendee-contact.entity';
import { AttendeeEvent } from '../../attend-event/entities/attendee-event.entity';
import { FilledForm } from '../../dynamic-forms/entities/filled-form.entity';
import { FollowingAttendee } from '../../organization/entities/following-attendee.entity';
import { AttendeesTickets } from '../../payment/entities/attendees.tickets';

@Entity('attendees')
export class Attendee extends BaseEntity {
  // Foreign Key
  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    name: 'first_name',
    type: 'varchar',
    nullable: false,
  })
  firstName!: string;

  @Column({
    name: 'last_name',
    type: 'varchar',
    nullable: false,
  })
  lastName!: string;

  @Column({
    name: 'phone_number',
    type: 'varchar',
    nullable: true,
  })
  phoneNumber?: string;

  @Column({
    name: 'profile_picture_url',
    type: 'text',
    nullable: true,
  })
  profilePictureUrl?: string;

  @Column({
    name: 'birth_date',
    type: 'date',
    nullable: true,
  })
  birthDate?: Date;

  @Column({
    name: 'bio',
    type: 'text',
    nullable: true,
  })
  bio?: string;

  @Column({
    name: 'cover_picture_url',
    type: 'text',
    nullable: true,
  })
  coverPictureUrl?: string;

  @OneToMany(
    () => AttendeeContact,
    (attendeeContact) => attendeeContact.attendee,
  )
  contacts: AttendeeContact[];

  @ManyToOne(() => Address, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'address_id', referencedColumnName: 'id' })
  address?: Address;

  @ManyToOne(() => Job, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'job_id', referencedColumnName: 'id' })
  job?: Job;

  @OneToMany(() => AttendeeEvent, (attendeeEvent) => attendeeEvent.attendee)
  events: AttendeeEvent[];

  @OneToMany(() => FilledForm, (filledForm) => filledForm.attendee)
  filledForms: FilledForm[];

  @OneToMany(
    () => FollowingAttendee,
    (followingAttendee) => followingAttendee.attendee,
  )
  followingOrganizations: FollowingAttendee[];

  @OneToMany(
    () => AttendeesTickets,
    (attendeeTickets) => attendeeTickets.attendee,
  )
  ticketsEvents: AttendeesTickets[];
}
