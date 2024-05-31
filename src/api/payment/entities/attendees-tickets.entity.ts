import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Attendee } from '../../attendee/entities/attendee.entity';
import { TicketEventType } from './ticket-event-type.entity';

@Entity({ name: 'attendees_tickets' })
export class AttendeesTickets {
  @PrimaryGeneratedColumn({
    name: 'id',
    type: 'bigint',
    unsigned: true,
  })
  id: number;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt!: Date;

  @Column({
    type: 'bigint',
  })
  value: number;

  @Column({ type: 'jsonb', nullable: false, default: {} })
  data: {};

  @ManyToOne(() => Attendee)
  @JoinColumn({ name: 'attendee_id' })
  attendee: Attendee;

  @ManyToOne(
    () => TicketEventType,
    (ticketEventType) => ticketEventType.attendeesTickets,
  )
  @JoinColumn({ name: 'event_type_id' })
  event: TicketEventType;

  @Column({ name: 'event_type_id' })
  event_type_id: number;
}
