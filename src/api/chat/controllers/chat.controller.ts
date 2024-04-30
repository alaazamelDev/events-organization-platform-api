import {
  Controller,
  Get,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AccessTokenGuard } from '../../../auth/guards/access-token.guard';
import { AttendeeService } from '../../attendee/services/attendee.service';
import { ChatApiService } from '../services/chat-api.service';
import { ChatListItemSerializer } from '../serializers/chat-list-item.serializer';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRoleEnum } from '../../userRole/enums/user-role.enum';
import { RoleGuard } from '../../../common/guards/role/role.guard';
import { ChatGroupFilter } from '../dto/chat-group.filter';
import { EntityIdMapperInterceptor } from '../../../common/interceptors/entity-id-mapper/entity-id-mapper.interceptor';

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
  @Roles(UserRoleEnum.ATTENDEE)
  @UseGuards(AccessTokenGuard, RoleGuard)
  async getChattingList(@Req() req: any) {
    const user = req.user;
    const userId = user.sub;

    // get the attendee Id
    const attendee = await this.attendeeService.getAttendeeByUserId(userId);

    // return the list.
    const result = await this.chatApiService.getChattingList(attendee.id);
    return ChatListItemSerializer.serializeList(result);
  }

  @Get('group')
  @Roles(UserRoleEnum.ATTENDEE)
  @UseGuards(AccessTokenGuard, RoleGuard)
  @UseInterceptors(EntityIdMapperInterceptor)
  async getChatGroup(@Req() req: any, @Query() params: ChatGroupFilter) {
    console.log(req, params);
    return '';
  }
}
