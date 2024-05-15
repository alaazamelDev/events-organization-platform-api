import { BaseEntity } from '../../../common/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Event } from '../../event/entities/event.entity';
import { FeaturedEventType } from './featured-event-type.entity';

@Entity({ name: 'featured_events' })
export class FeaturedEvent extends BaseEntity {
  @ManyToOne(() => Event)
  @JoinColumn({ name: 'event_id' })
  event: Event;

  @Column({ name: 'start_date' })
  startDate: Date;

  @Column({ name: 'end_date' })
  endDate: Date;

  @ManyToOne(() => FeaturedEventType)
  @JoinColumn({ name: 'type_id' })
  type: FeaturedEventType;
}
