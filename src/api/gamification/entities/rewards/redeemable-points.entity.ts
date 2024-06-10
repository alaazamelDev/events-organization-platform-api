import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../../common/entities/base.entity';
import { RewardEntity } from './reward.entity';

@Entity({ name: 'g_redeemable_points' })
export class RedeemablePointsEntity extends BaseEntity {
  @Column()
  value: number;

  @OneToOne(() => RewardEntity)
  @JoinColumn({ name: 'reward_id' })
  reward: RewardEntity;

  @Column({ name: 'reward_id' })
  reward_id: number;
}
