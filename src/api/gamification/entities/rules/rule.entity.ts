import { BaseEntity } from '../../../../common/entities/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { RuleConditionEntity } from './rule-condition.entity';
import { RewardEntity } from '../rewards/reward.entity';

@Entity({ name: 'g_rules' })
export class RuleEntity extends BaseEntity {
  @Column()
  name: string;

  @OneToMany(
    () => RuleConditionEntity,
    (ruleConditionEntity) => ruleConditionEntity.rule,
  )
  conditions: RuleConditionEntity[];

  @OneToMany(() => RewardEntity, (rewardEntity) => rewardEntity.rule)
  rewards: RewardEntity;

  @Column({ default: true })
  enabled: boolean;
}
