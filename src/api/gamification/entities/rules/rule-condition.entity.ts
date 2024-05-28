import { BaseEntity } from '../../../../common/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { DefinedDataEntity } from '../data-definition/defined-data.entity';
import { OperatorEntity } from '../data-definition/operator.entity';
import { RuleEntity } from './rule.entity';

@Entity({ name: 'g_rules_conditions' })
export class RuleConditionEntity extends BaseEntity {
  @ManyToOne(() => DefinedDataEntity)
  @JoinColumn({ name: 'defined_data_id' })
  definedData: DefinedDataEntity;

  @ManyToOne(() => OperatorEntity)
  @JoinColumn({ name: 'operator_id' })
  operator: OperatorEntity;

  @ManyToOne(() => RuleEntity)
  @JoinColumn({ name: 'rule_id' })
  rule: RuleEntity;

  @Column()
  value: string;

  @Column({ type: 'timestamp', nullable: true })
  time: Date | null;
}
