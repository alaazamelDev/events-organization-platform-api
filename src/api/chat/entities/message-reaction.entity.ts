import { BaseEntity } from '../../../common/entities/base.entity';
import { Entity, JoinColumn, ManyToOne, RelationId } from 'typeorm';
import { GroupMessage } from './group-message.entity';
import { Reaction } from './reaction.entity';
import { User } from '../../user/entities/user.entity';

@Entity('message_reaction')
export class MessageReaction extends BaseEntity {
  @ManyToOne(() => GroupMessage, (type) => type.reactions)
  @JoinColumn({ name: 'message_id' })
  message: GroupMessage;

  @RelationId((mR: MessageReaction) => mR.message, 'message_id')
  messageId: number;

  @ManyToOne(() => Reaction, { eager: true })
  @JoinColumn({ name: 'reaction_id' })
  reaction: Reaction;

  @RelationId((mR: MessageReaction) => mR.reaction, 'reaction_id')
  reactionId: number;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'reactor_id' })
  reactedBy: User;
}
