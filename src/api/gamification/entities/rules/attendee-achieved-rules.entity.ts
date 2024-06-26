import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../../common/entities/base.entity';
import { Attendee } from '../../../attendee/entities/attendee.entity';
import { RuleEntity } from './rule.entity';

@Entity({ name: 'g_attendee_achieved_rules' })
export class AttendeeAchievedRulesEntity extends BaseEntity {
  @ManyToOne(() => Attendee)
  @JoinColumn({ name: 'attendee_id' })
  attendee: Attendee;

  @Column({ name: 'attendee_id' })
  attendee_id: number;

  @ManyToOne(() => RuleEntity)
  @JoinColumn({ name: 'rule_id' })
  rule: RuleEntity;

  @Column({ name: 'rule_id' })
  rule_id: number;
}
