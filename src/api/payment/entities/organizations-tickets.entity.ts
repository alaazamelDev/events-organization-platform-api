import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Attendee } from '../../attendee/entities/attendee.entity';
import { Organization } from '../../organization/entities/organization.entity';

@Entity({ name: 'organizers_tickets' })
export class OrganizationsTickets {
  @PrimaryGeneratedColumn({
    name: 'id',
    type: 'bigint',
    unsigned: true,
  })
  id: number;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt!: Date;

  @Column({
    type: 'bigint',
  })
  value: number;

  @Column({ type: 'jsonb', nullable: false, default: {} })
  data: {};

  @ManyToOne(() => Organization)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;
}
