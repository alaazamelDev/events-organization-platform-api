import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { FeaturedEvent } from './featured-event.entity';

@Entity({ name: 'featured_events_types' })
export class FeaturedEventType extends BaseEntity {
  @Column()
  name: string;

  @OneToMany(() => FeaturedEvent, (featuredEvent) => featuredEvent.type)
  featuredEvents: FeaturedEvent;
}
