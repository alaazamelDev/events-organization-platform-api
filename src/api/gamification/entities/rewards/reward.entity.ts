import { BaseEntity } from '../../../../common/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { RuleEntity } from '../rules/rule.entity';
import { RewardTypeEntity } from './reward-type.entity';
import { Employee } from '../../../employee/entities/employee.entity';
import { Attendee } from '../../../attendee/entities/attendee.entity';
import { Admin } from '../../../admin/entities/admin.entity';
import { BadgeEntity } from './badge.entity';
import { PointsEntity } from './points.entity';
import { RedeemablePointsEntity } from './redeemable-points.entity';

@Entity({ name: 'g_rewards' })
export class RewardEntity extends BaseEntity {
  @Column()
  name: string;

  @ManyToOne(() => RuleEntity)
  @JoinColumn({ name: 'rule_id' })
  rule: RuleEntity | null;

  @ManyToOne(() => RewardTypeEntity)
  @JoinColumn({ name: 'type_id' })
  type: RewardTypeEntity;

  @Column({ name: 'type_id' })
  type_id: number;

  @OneToOne(() => BadgeEntity, (badge) => badge.reward)
  badge?: BadgeEntity;

  @OneToOne(() => PointsEntity, (points) => points.reward)
  points?: PointsEntity;

  @OneToOne(() => RedeemablePointsEntity, (rp) => rp.reward)
  rp?: RedeemablePointsEntity;
}
