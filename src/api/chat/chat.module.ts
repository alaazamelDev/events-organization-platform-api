import { Module } from '@nestjs/common';
import { ChatService } from './services/chat.service';
import { ChatController } from './controllers/chat.controller';
import { ChatApiService } from './services/chat-api.service';
import { AttendeeModule } from '../attendee/attendee.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupMessage } from './entities/group-message.entity';
import { ChatGroup } from './entities/chat-group.entity';
import { UserModule } from '../user/user.module';
import { Reaction } from './entities/reaction.entity';
import { MessageReaction } from './entities/message-reaction.entity';
import { FileUtilityModule } from '../../config/files/utility/file-utility.module';

@Module({
  imports: [
    UserModule,
    AttendeeModule,
    TypeOrmModule.forFeature([
      GroupMessage,
      ChatGroup,
      Reaction,
      MessageReaction,
    ]),
    FileUtilityModule,
  ],
  providers: [ChatService, ChatApiService],
  controllers: [ChatController],
})
export class ChatModule {}
