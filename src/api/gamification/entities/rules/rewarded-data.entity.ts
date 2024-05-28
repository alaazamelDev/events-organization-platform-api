import { BaseEntity } from '../../../../common/entities/base.entity';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { InsertedDataEntity } from '../data-insertion/inserted-data.entity';
import { RuleEntity } from './rule.entity';

@Entity({ name: 'g_rewarded_data' })
export class RewardedDataEntity extends BaseEntity {
  @ManyToOne(
    () => InsertedDataEntity,
    (insertedDataEntity) => insertedDataEntity.rewardedRules,
  )
  @JoinColumn({ name: 'inserted_data_id' })
  insertedData: InsertedDataEntity;

  @ManyToOne(() => RuleEntity)
  @JoinColumn({ name: 'rule_id' })
  rule: RuleEntity;
}
