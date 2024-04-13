import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { ContactOrganization } from './contact_organization.entity';
import { Employee } from '../../employee/entities/employee.entity';
import { AddressOrganization } from './address_organization.entity';
import { Form } from '../../dynamic-forms/entities/form.entity';
import { BlockedAttendee } from './blocked-attendee.entity';
import { FollowingAttendee } from './following-attendee.entity';

@Entity({ name: 'organizations' })
export class Organization extends BaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true, type: 'text' })
  main_picture!: string | null;

  @Column({ nullable: true, type: 'text' })
  cover_picture!: string | null;

  @OneToMany(
    () => ContactOrganization,
    (contactOrganization) => contactOrganization.organization,
  )
  contacts: ContactOrganization[];

  @OneToMany(() => Employee, (employee) => employee.organization)
  employees: Employee[];

  @OneToMany(
    () => AddressOrganization,
    (addressOrganization) => addressOrganization.organization,
  )
  addresses: AddressOrganization[];

  @OneToMany(() => Form, (form) => form.organization)
  forms: Form[];

  @OneToMany(
    () => BlockedAttendee,
    (blockedAttendee) => blockedAttendee.organization,
  )
  blockedAttendees?: BlockedAttendee[];

  @OneToMany(
    () => FollowingAttendee,
    (followingAttendee) => followingAttendee.organization,
  )
  followingAttendees?: FollowingAttendee[];
}
