import { BaseEntity } from '../../../../common/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'g_reward_types' })
export class RewardTypeEntity extends BaseEntity {
  @Column()
  name: string;
}
