import { BaseEntity } from '../../../common/entities/base.entity';
import { Attendee } from '../../attendee/entities/attendee.entity';
import { Event } from '../../event/entities/event.entity';
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { AttendeeEventStatus } from '../enums/attendee-event-status.enum';

@Entity()
@Unique(['attendee', 'event'])
export class AttendeeEvent extends BaseEntity {
  @ManyToOne(() => Attendee, (attendee) => attendee.events)
  @JoinColumn({ name: 'attendee_id' })
  attendee: Attendee;

  @ManyToOne(() => Event, (event) => event.attendees)
  @JoinColumn({ name: 'event_id' })
  event: Event;

  @Column({
    type: 'enum',
    enum: AttendeeEventStatus,
  })
  status: AttendeeEventStatus;
}
