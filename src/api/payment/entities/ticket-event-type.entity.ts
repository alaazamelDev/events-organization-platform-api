import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { AttendeesTickets } from './attendees-tickets.entity';

@Entity({ name: 'ticket_event_type' })
export class TicketEventType extends BaseEntity {
  @Column()
  name: string;

  @OneToMany(() => AttendeesTickets, (attendeeTikcets) => attendeeTikcets.event)
  attendeesTickets: AttendeesTickets[];
}
