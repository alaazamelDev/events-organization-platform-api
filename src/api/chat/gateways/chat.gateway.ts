import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { SocketAuthenticationMiddleware } from '../../../common/middleware/socket-authentication.middleware';
import { JwtService } from '@nestjs/jwt';
import { JwtConfigService } from '../../../config/secrets/jwt/config.service';
import { AuthenticatedSocketType } from '../../../common/types/authenticated-socket.type';
import { ChatService } from '../services/chat.service';
import { SentMessageDto } from '../dto/sent-message.dto';
import { UserRole } from '../../userRole/entities/user_role.entity';
import { MessageSenderType } from '../enums/message-sender-type.enum';
import { GroupMessageType } from '../types/group-message.type';
import { GroupMessageSerializer } from '../serializers/group-message.serializer';
import { FileUtilityService } from '../../../config/files/utility/file-utility.service';
import { Notification } from '../../../common/types/notification.type';
import { NotificationTypeEnum } from '../../../common/entities/notification-type.enum';
import { UserReactionDto } from '../dto/user-reaction.dto';
import { MessageReactionType } from '../types/message-reaction.type';

@WebSocketGateway(3001, {
  namespace: 'chat',
  cors: { origin: '*', methods: ['GET', 'POST'] },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly jwtService: JwtService,
    private readonly jwtConfigService: JwtConfigService,
    private readonly chatService: ChatService,
    private readonly fileUtilityService: FileUtilityService,
  ) {}

  @WebSocketServer()
  server: Server;

  private static participants: Map<number, AuthenticatedSocketType> = new Map(); // userId => Socket

  async emitGroupJoinedEvent(
    userId: number,
    group: { group_id: number; channel: string },
  ) {
    if (ChatGateway.participants.has(userId)) {
      const socket = ChatGateway.participants.get(userId);
      socket!.emit('group-joined', { group });
    }
  }

  async emitNotificationReceivedEvent(
    userId: number,
    notification: Notification,
  ) {
    if (ChatGateway.participants.has(userId)) {
      const socket = ChatGateway.participants.get(userId);
      socket!.emit('notification-received', { ...notification });
    }
  }

  async emitUserKickedOffEvent(
    userId: number,
    group: { group_id: number; channel: string },
  ) {
    if (ChatGateway.participants.has(userId)) {
      const socket = ChatGateway.participants.get(userId);
      socket!.emit('user-kicked-off', { group });
    }
  }

  @SubscribeMessage('message-sent')
  async handleMessageSent(
    @MessageBody() data: SentMessageDto,
    @ConnectedSocket() client: AuthenticatedSocketType,
  ) {
    // TODO: VALIDATE THAT USER HAS RIGHT TO SEND MESSAGE TO THE GIVEN GROUP ID.

    // append the additional fields
    const completeData: GroupMessageType = {
      ...data,
      sender_id: client.user.sub,
      senderType:
        client.user.role_id == +UserRole.ATTENDEE
          ? MessageSenderType.attendee
          : MessageSenderType.organizer,
    };

    // then, store the message. and multicast it
    const stored = await this.chatService.storeMessage(completeData);

    // notify the list of receivers that are active.
    await this.chatService
      .getMessageReceiverUserIds(data.group_id)
      .then((ids) =>
        ids.forEach((userId: number) => {
          const notification: Notification = {
            type: NotificationTypeEnum.message_received,
            data: GroupMessageSerializer.serialize(
              this.fileUtilityService,
              stored!,
            ),
          };
          this.emitNotificationReceivedEvent(userId, notification);
        }),
      );

    // broadcast the message to the same group.
    this.server.emit(`group-${data.group_id}`, {
      message: GroupMessageSerializer.serialize(
        this.fileUtilityService,
        stored!,
      ),
    });
  }

  @SubscribeMessage('user-reacted')
  async userReacted(
    @MessageBody() data: UserReactionDto,
    @ConnectedSocket() client: AuthenticatedSocketType,
  ) {
    // create the complete data object
    const completeData: MessageReactionType = {
      reaction_id: data.reaction_id,
      message_id: data.message_id,
      reactor_id: client.user.sub,
    };

    // store the reaction...
    const updatedMessage = await this.chatService.storeReaction(completeData);

    // broadcast the reaction to the same group.
    this.server.emit(`group-${data.group_id}/reaction`, {
      message: GroupMessageSerializer.serialize(
        this.fileUtilityService,
        updatedMessage!,
      ),
    });
  }

  // Secure the Connection
  async afterInit(): Promise<void> {
    // Add Middleware to protect the connection.
    this.server.use(
      SocketAuthenticationMiddleware(this.jwtService, this.jwtConfigService),
    );
  }

  // send list of groups metadata to the connected user
  async handleConnection(socket: AuthenticatedSocketType): Promise<void> {
    // add the socket to the map of active participants
    ChatGateway.participants.set(socket.user.sub, socket);
  }

  async handleDisconnect(socket: AuthenticatedSocketType): Promise<void> {
    // remove the participant from active participants map.
    ChatGateway.participants.delete(socket.user.sub);
  }
}
