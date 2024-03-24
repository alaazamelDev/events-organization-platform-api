import { BaseEntity } from '../../../common/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Event } from './event.entity';
import { ApprovalStatus } from '../../approval-status/entities/approval-status.entity';
import { User } from '../../user/entities/user.entity';

@Entity('event_approval_status')
export class EventApprovalStatus extends BaseEntity {
  @ManyToOne(() => ApprovalStatus, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'approval_status_id' })
  approvalStatus: ApprovalStatus;

  @ManyToOne(() => Event, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'event_id' })
  event: Event;

  @ManyToOne(() => User, {
    onDelete: 'SET NULL',
    eager: true,
    nullable: true,
  })
  @JoinColumn({ name: 'set_by' })
  setBy?: User;

  @Column({
    name: 'from_date',
    type: 'date',
    nullable: true,
  })
  fromDate?: Date;

  @Column({
    name: 'to_date',
    type: 'date',
    nullable: true,
  })
  toDate?: Date;

  @Column({
    name: 'note',
    type: 'text',
    nullable: true,
  })
  note?: string;
}
