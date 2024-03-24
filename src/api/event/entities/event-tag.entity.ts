import { BaseEntity } from '../../../common/entities/base.entity';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Tag } from '../../tag/entities/tag.entity';
import { Event } from './event.entity';

@Entity('event_tag')
export class EventTag extends BaseEntity {
  @ManyToOne(() => Tag, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'tag_id' })
  tag: Tag;

  @ManyToOne(() => Event, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'event_id' })
  event: Event;
}
