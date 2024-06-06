import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Attendee } from '../../../attendee/entities/attendee.entity';
import { BaseEntity } from '../../../../common/entities/base.entity';

@Entity({ name: 'g_attendee_redeemable_points' })
export class AttendeeRedeemablePointsEntity extends BaseEntity {
  @ManyToOne(() => Attendee, (attendee) => attendee.redeemablePoints)
  @JoinColumn({ name: 'attendee_id' })
  attendee: Attendee;

  @Column()
  value: number;

  @Column({ name: 'meta_data', type: 'jsonb' })
  metaData: {};
}
