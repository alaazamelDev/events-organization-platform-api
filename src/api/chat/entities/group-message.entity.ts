import { BaseEntity } from '../../../common/entities/base.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  RelationId,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { MessageSenderType } from '../enums/message-sender-type.enum';
import { ChatGroup } from './chat-group.entity';
import { MessageReaction } from './message-reaction.entity';

@Entity('group_messages')
export class GroupMessage extends BaseEntity {
  @ManyToOne(() => ChatGroup, (type) => type.messages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'chat_group_id' })
  group: ChatGroup;

  @RelationId(
    (groupMessage: GroupMessage) => groupMessage.group,
    'chat_group_id',
  )
  groupId?: number;

  @Column({
    name: 'text',
    nullable: false,
    type: 'text',
  })
  content: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'sender_id' })
  sender: User;

  @RelationId((groupMessage: GroupMessage) => groupMessage.sender, 'sender_id')
  senderId?: number;

  @Column({
    enum: MessageSenderType,
    name: 'sender_type',
    nullable: false,
    type: 'enum',
  })
  senderType: MessageSenderType;

  @OneToMany(() => MessageReaction, (type) => type.message, { eager: true })
  reactions: MessageReaction[];

  @ManyToOne(() => GroupMessage, { nullable: true })
  @JoinColumn({ name: 'replied_message_id' })
  repliedMessage?: GroupMessage;
}
