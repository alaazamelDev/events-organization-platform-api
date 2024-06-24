import { BaseEntity } from '../../../common/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne, RelationId } from 'typeorm';
import { NotificationType } from './notification-type.entity';

@Entity('notifications')
export class Notification extends BaseEntity {
  @ManyToOne(() => NotificationType, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'type_id' })
  type: NotificationType;

  @RelationId((notification: Notification) => notification.type, 'type_id')
  typeId: number;

  @Column({
    name: 'title',
    type: 'varchar',
  })
  title: string;

  @Column({
    name: 'seen',
    type: 'boolean',
    default: false,
  })
  seen: boolean;

  @Column({
    name: 'relation_id',
    type: 'unsigned big int',
    nullable: true,
  })
  relationId?: number;

  @Column({
    name: 'relation_type',
    type: 'varchar',
    nullable: true,
  })
  relationType?: string;
}
