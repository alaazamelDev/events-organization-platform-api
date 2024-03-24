import { BaseEntity } from '../../../common/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Event } from './event.entity';

@Entity('event_attachments')
export class EventAttachment extends BaseEntity {
  @ManyToOne(() => Event, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'event_id' })
  event: Event;

  @Column({
    name: 'file_name',
    type: 'varchar',
  })
  fileName!: string;

  @Column({
    name: 'file_url',
    type: 'text',
  })
  fileUrl!: string;
}
