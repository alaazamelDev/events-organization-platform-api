import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../../common/entities/base.entity';
import { RewardEntity } from './reward.entity';
import { AttendeeBadgeEntity } from '../rewards-attendee/attendee-badge.entity';

@Entity({ name: 'g_badges' })
export class BadgeEntity extends BaseEntity {
  @Column({ type: 'jsonb' })
  shape: {};

  @Column()
  visibility: boolean;

  @Column()
  anonymous: boolean;

  @OneToOne(() => RewardEntity)
  @JoinColumn({ name: 'reward_id' })
  reward: RewardEntity;

  @Column({ name: 'reward_id' })
  reward_id: number;

  @OneToMany(
    () => AttendeeBadgeEntity,
    (attendeeBadgeEntity) => attendeeBadgeEntity.badge,
  )
  attendees: AttendeeBadgeEntity[];

  [key: string]: any;
}
