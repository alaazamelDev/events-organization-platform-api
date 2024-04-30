import { BaseEntity } from '../../../common/entities/base.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { GroupMessage } from './group-message.entity';
import { Event } from '../../event/entities/event.entity';
import { MessageGroupStatus } from '../enums/message-group-status.enum';

@Entity('chat_groups')
export class ChatGroup extends BaseEntity {
  @Column({
    default: MessageGroupStatus.disabled,
    enum: MessageGroupStatus,
    name: 'group_status',
    nullable: false,
    type: 'enum',
  })
  status: MessageGroupStatus;

  @Column({
    default: 'Chatting Group',
    name: 'group_title',
    type: 'varchar',
  })
  groupTitle: string;

  // Relations
  @OneToOne(() => Event, { cascade: true })
  @JoinColumn({ name: 'event_id' })
  event: Event;

  @OneToMany(() => GroupMessage, (type) => type.group, { eager: true })
  messages: GroupMessage[];

  memberCount?: number;
}
