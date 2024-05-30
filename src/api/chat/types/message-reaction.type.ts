import { UserReactionDto } from '../dto/user-reaction.dto';

export type MessageReactionType = Omit<UserReactionDto, 'group_id'> & {
  reactor_id: number;
};
