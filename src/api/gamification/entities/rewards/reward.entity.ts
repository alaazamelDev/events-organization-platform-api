import { BaseEntity } from '../../../../common/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { RuleEntity } from '../rules/rule.entity';
import { RewardTypeEntity } from './reward-type.entity';

@Entity({ name: 'g_rewards' })
export class RewardEntity extends BaseEntity {
  @Column()
  name: string;

  @ManyToOne(() => RuleEntity)
  @JoinColumn({ name: 'rule_id' })
  rule: RuleEntity;

  @ManyToOne(() => RewardTypeEntity)
  @JoinColumn({ name: 'type_id' })
  type: RewardTypeEntity;

  @Column({ name: 'type_id' })
  type_id: number;
}
