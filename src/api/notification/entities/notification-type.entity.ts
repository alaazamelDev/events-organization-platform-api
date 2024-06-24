import { BaseEntity } from '../../../common/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('notification_types')
export class NotificationType extends BaseEntity {
  // Define the static notification type ids...
  static EVENT_CREATED: number = 1;
  static ATTENDEE_ACCEPTED: number = 2;
  static ATTENDEE_REJECTED: number = 3;
  static GOT_REPLY: number = 4;
  static GOT_REACTION: number = 5;

  @Column({
    type: 'varchar',
    name: 'name',
  })
  name: string;

  @Column({
    type: 'text',
    name: 'icon',
  })
  icon: string;
}
