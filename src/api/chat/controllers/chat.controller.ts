import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from '../../../auth/guards/access-token.guard';
import { AttendeeService } from '../../attendee/services/attendee.service';
import { ChatApiService } from '../services/chat-api.service';
import { ChatListItemSerializer } from '../serializers/chat-list-item.serializer';

@Controller('chat')
export class ChatController {
  private readonly attendeeService: AttendeeService;
  private readonly chatApiService: ChatApiService;

  constructor(
    attendeeService: AttendeeService,
    chatApiService: ChatApiService,
  ) {
    this.attendeeService = attendeeService;
    this.chatApiService = chatApiService;
  }

  @Get('attendee')
  @UseGuards(AccessTokenGuard)
  async getChattingList(@Req() req: any) {
    const user = req.user;
    const userId = user.sub;

    // get the attendee Id
    const attendee = await this.attendeeService.getAttendeeByUserId(userId);

    // return the list.
    const result = await this.chatApiService.getChattingList(attendee.id);
    return ChatListItemSerializer.serializeList(result);
  }
}
