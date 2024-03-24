import { BaseEntity } from '../../../common/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Event } from './event.entity';

@Entity('event_days')
export class EventDay extends BaseEntity {
  @ManyToOne(() => Event, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'event_id' })
  event!: Event;

  @Column({
    name: 'day_date',
    type: 'date',
  })
  dayDate!: Date;

  @Column({
    name: 'start_time',
    type: 'timestamptz',
    nullable: true,
  })
  startTime?: Date;

  @Column({
    name: 'end_time',
    type: 'timestamptz',
    nullable: true,
  })
  endTime?: Date;
}
