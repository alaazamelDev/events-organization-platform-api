import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { SocketAuthenticationMiddleware } from '../../../common/middleware/socket-authentication.middleware';
import { JwtService } from '@nestjs/jwt';
import { JwtConfigService } from '../../../config/secrets/jwt/config.service';
import { AuthenticatedSocketType } from '../../../common/types/authenticated-socket.type';
import { ChatService } from '../services/chat.service';

@WebSocketGateway(3001, {
  cors: '*',
  namespace: 'chat',
  transports: ['websocket'],
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly jwtService: JwtService,
    private readonly jwtConfigService: JwtConfigService,
    private readonly chatService: ChatService,
  ) {}

  @WebSocketServer()
  server: Server;

  private static participants: Map<number, AuthenticatedSocketType> = new Map(); // userId => Socket

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

    // send the list of events that user have to listen to.
    const groups = await this.chatService.getListOfChannels(socket.user);
    socket.emit('groups-joined', { groups });
  }

  async handleDisconnect(socket: AuthenticatedSocketType): Promise<void> {
    // remove the participant from active participants map.
    ChatGateway.participants.delete(socket.user.sub);
  }
}
