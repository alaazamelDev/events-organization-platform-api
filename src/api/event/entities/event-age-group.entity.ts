import { BaseEntity } from '../../../common/entities/base.entity';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Event } from './event.entity';
import { AgeGroup } from '../../age-group/entities/age-group.entity';

@Entity('event_age_group')
export class EventAgeGroup extends BaseEntity {
  @ManyToOne(() => AgeGroup, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'age_group_id' })
  ageGroup: AgeGroup;

  @ManyToOne(() => Event, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'event_id' })
  event: Event;
}
