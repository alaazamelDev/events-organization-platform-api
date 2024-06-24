import { BaseEntity } from '../../../common/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('notification_types')
export class NotificationType extends BaseEntity {
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
