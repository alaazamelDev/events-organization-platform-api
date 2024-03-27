import { BaseEntity } from '../../../common/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { EventDay } from './event-day.entity';
import { SlotStatus } from '../../slot-status/entities/slot-status.entity';
import * as moment from 'moment';
import { DEFAULT_DB_DATETIME_FORMAT } from '../../../common/constants/constants';

@Entity('event_day_slots')
export class EventDaySlot extends BaseEntity {
  @ManyToOne(() => EventDay, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'event_day_id' })
  eventDay!: EventDay;

  @ManyToOne(() => SlotStatus, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'slot_status_id' })
  slotStatus?: SlotStatus;

  @Column({
    name: 'label',
    type: 'varchar',
  })
  label!: string;

  @Column({
    name: 'start_time',
    type: 'timestamptz',
    transformer: {
      from(value: any): Date {
        // Format value when reading from the database
        return moment(value).toDate();
      },
      to(value: Date): any {
        // Format value when writing to the database
        return moment(value).format(DEFAULT_DB_DATETIME_FORMAT);
      },
    },
  })
  startTime: Date;

  @Column({
    name: 'end_time',
    type: 'timestamptz',
    transformer: {
      from(value: any): Date {
        // Format value when reading from the database
        return moment(value).toDate();
      },
      to(value: Date): any {
        return moment(value).format(DEFAULT_DB_DATETIME_FORMAT);
      },
    },
  })
  endTime: Date;
}
