import { BaseEntity } from '../../../common/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Organization } from '../../organization/entities/organization.entity';
import { Address } from '../../address/entities/address.entity';
import { EventType } from '../enums/event-type.enum';
import { EventTag } from './event-tag.entity';
import { EventPhoto } from './event-photo.entity';
import { EventAttachment } from './event-attachment.entity';
import { EventApprovalStatus } from './event-approval-status.entity';
import { EventAgeGroup } from './event-age-group.entity';
import { AttendeeEvent } from '../../attend-event/entities/attendee-event.entity';
import { EventDay } from '../../event-day/entities/event-day.entity';
import { Form } from '../../dynamic-forms/entities/form.entity';
import { FilledForm } from '../../dynamic-forms/entities/filled-form.entity';

@Entity('events')
export class Event extends BaseEntity {
  @ManyToOne(() => Organization, {
    onDelete: 'CASCADE',
    nullable: false,
    eager: true,
  })
  @JoinColumn({ name: 'organization_id' })
  organization!: Organization;

  @ManyToOne(() => Address, {
    onDelete: 'SET NULL',
    nullable: true,
    eager: true,
  })
  @JoinColumn({ name: 'address_id' })
  address?: Address;

  @Column({
    name: 'address_notes',
    type: 'varchar',
    nullable: true,
  })
  addressNotes?: string;

  @Column({
    name: 'location',
    type: 'simple-json',
    nullable: true,
  })
  location?: { longitude: number; latitude: number };

  @Column({
    name: 'title',
    type: 'text',
  })
  title!: string;

  @Column({
    name: 'cover_picture_url',
    type: 'text',
  })
  coverPictureUrl!: string;

  @Column({
    name: 'description',
    type: 'text',
  })
  description!: string;

  @Column({
    name: 'capacity',
    type: 'integer',
  })
  capacity!: number;

  @Column({
    name: 'event_type',
    type: 'enum',
    enum: EventType,
    default: EventType.Onsite,
  })
  eventType!: EventType;

  @Column({
    name: 'direct_register',
    type: 'boolean',
    default: true,
  })
  directRegister: boolean;

  @Column({
    name: 'registration_start_date',
    type: 'timestamptz',
  })
  registrationStartDate!: Date;

  @Column({
    name: 'registration_end_date',
    type: 'timestamptz',
    nullable: false,
  })
  registrationEndDate?: Date;

  // RELATED MODELS
  @OneToMany(() => EventTag, (tags) => tags.event, {
    eager: true,
  })
  tags: EventTag[];

  @OneToMany(() => EventAgeGroup, (ageGroups) => ageGroups.event, {
    eager: true,
  })
  targetedAgrGroups: EventAgeGroup[];

  @OneToMany(() => EventDay, (days) => days.event, {
    eager: true,
  })
  days: EventDay[];

  @OneToMany(() => EventPhoto, (photos) => photos.event, {
    eager: true,
  })
  photos: EventPhoto[];

  @OneToMany(() => EventAttachment, (attachments) => attachments.event, {
    eager: true,
  })
  attachments: EventAttachment[];

  @OneToMany(
    () => EventApprovalStatus,
    (approvalStatuses) => approvalStatuses.event,
    {
      eager: true,
    },
  )
  approvalStatuses: EventApprovalStatus[];

  @OneToMany(() => AttendeeEvent, (attendeeEvent) => attendeeEvent.event)
  attendees: AttendeeEvent[];

  @ManyToOne(() => Form, (form) => form.events)
  @JoinColumn({ name: 'form_id' })
  form: Form;

  @OneToMany(() => FilledForm, (filledForm) => filledForm.event)
  filledForms: FilledForm[];
}
