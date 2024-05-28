import { BaseEntity } from '../../../../common/entities/base.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { RewardEntity } from './reward.entity';

@Entity({ name: 'g_points' })
export class PointsEntity extends BaseEntity {
  @Column()
  value: number;

  @OneToOne(() => RewardEntity)
  @JoinColumn({ name: 'reward_id' })
  reward: RewardEntity;
}
