import { BaseEntity } from '../../../common/entities/base.entity';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Organization } from './organization.entity';
import { Attendee } from '../../attendee/entities/attendee.entity';

@Entity('following_attendee')
export class FollowingAttendee extends BaseEntity {
  @ManyToOne(() => Organization)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @ManyToOne(() => Attendee)
  @JoinColumn({ name: 'attendee_id' })
  attendee: Attendee;
}
