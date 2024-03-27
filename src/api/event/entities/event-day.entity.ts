import { BaseEntity } from '../../../common/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Event } from './event.entity';
import { EventDaySlot } from './event-day-slot.entity';
import * as moment from 'moment';
import { DEFAULT_DB_DATE_FORMAT } from '../../../common/constants/constants';

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
    transformer: {
      from(value: any): any {
        return moment(value).format(DEFAULT_DB_DATE_FORMAT);
      },
      to(value: any): any {
        return value;
      },
    },
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

  @OneToMany(() => EventDaySlot, (slot) => slot.eventDay, { eager: true })
  slots?: EventDaySlot[];
}
