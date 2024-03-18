import {
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  Entity,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Organization } from './organization.entity';
import { Contact } from '../../contact/entities/contact.entity';
@Entity()
@Unique(['organization', 'contact'])
export class ContactOrganization {
  @PrimaryGeneratedColumn({
    name: 'id',
    type: 'bigint',
    unsigned: true,
  })
  id: number;

  @Column()
  content: string;

  @ManyToOne(() => Organization, (organization) => organization.contacts)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @ManyToOne(() => Contact, (contact) => contact.organizations)
  @JoinColumn({ name: 'contact_id' })
  contact: Contact;
}
