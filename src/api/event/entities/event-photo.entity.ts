import { BaseEntity } from '../../../common/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Event } from './event.entity';

@Entity('event_photos')
export class EventPhoto extends BaseEntity {
  @ManyToOne(() => Event, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'event_id' })
  event: Event;

  @Column({
    name: 'photo_name',
    type: 'varchar',
  })
  photoName!: string;

  @Column({
    name: 'photo_url',
    type: 'text',
  })
  photoUrl!: string;
}
