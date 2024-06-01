import { BaseEntity } from '../../../../common/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { RuleEntity } from './rule.entity';
import { DefinedDataEntity } from '../data-definition/defined-data.entity';
import { Attendee } from '../../../attendee/entities/attendee.entity';

@Entity({ name: 'g_rewarded_data' })
export class RewardedDataEntity extends BaseEntity {
  @ManyToOne(() => DefinedDataEntity)
  @JoinColumn({ name: 'defined_data_id' })
  definedData: DefinedDataEntity;

  @ManyToOne(() => RuleEntity)
  @JoinColumn({ name: 'rule_id' })
  rule: RuleEntity;

  @ManyToOne(() => Attendee)
  @JoinColumn({ name: 'attendee_id' })
  attendee: Attendee;

  @Column({ name: 'defined_data_id' })
  defined_data_id: number;

  @Column({ name: 'rule_id' })
  rule_id: number;

  @Column({ name: 'attendee_id' })
  attendee_id: number;

  @Column()
  value: number;
}
