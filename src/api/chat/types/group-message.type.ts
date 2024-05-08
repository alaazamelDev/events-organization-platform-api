import { SentMessageDto } from '../dto/sent-message.dto';
import { MessageSenderType } from '../enums/message-sender-type.enum';

export type GroupMessageType = SentMessageDto & {
  senderType: MessageSenderType;
  sender_id: number;
};
