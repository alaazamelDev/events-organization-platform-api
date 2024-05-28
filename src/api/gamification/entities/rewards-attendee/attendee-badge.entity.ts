import { BaseEntity } from '../../../../common/entities/base.entity';
import { Attendee } from '../../../attendee/entities/attendee.entity';
import { BadgeEntity } from '../rewards/badge.entity';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'g_attendee_badges' })
export class AttendeeBadgeEntity extends BaseEntity {
  @ManyToOne(() => Attendee)
  @JoinColumn({ name: 'attendee_id' })
  attendee: Attendee;

  @ManyToOne(() => BadgeEntity)
  @JoinColumn({ name: 'badge_id' })
  badge: BadgeEntity;
}
