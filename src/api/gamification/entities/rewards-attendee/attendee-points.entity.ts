import { BaseEntity } from '../../../../common/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Attendee } from '../../../attendee/entities/attendee.entity';

@Entity({ name: 'g_attendee_points' })
export class AttendeePointsEntity extends BaseEntity {
  @ManyToOne(() => Attendee, (attendee) => attendee.points)
  @JoinColumn({ name: 'attendee_id' })
  attendee: Attendee;

  @Column()
  value: number;

  @Column({ name: 'meta_data', type: 'jsonb' })
  metaData: {};
}
