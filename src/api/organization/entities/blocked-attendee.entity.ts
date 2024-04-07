import { BaseEntity } from '../../../common/entities/base.entity';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Organization } from './organization.entity';
import { Attendee } from '../../attendee/entities/attendee.entity';
import { User } from '../../user/entities/user.entity';

@Entity('blocked_attendees')
export class BlockedAttendee extends BaseEntity {
  // organization reference.
  @ManyToOne(() => Organization)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  // attendee reference.
  @ManyToOne(() => Attendee)
  @JoinColumn({ name: 'attendee_id' })
  attendee: Attendee;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'blocked_by' })
  blockedBy?: User;
}
