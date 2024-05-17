import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { EventService } from './event.service';
import { AccessTokenGuard } from '../../auth/guards/access-token.guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorageGenerator } from '../../config/files/disk-storage.generator';
import {
  DEFAULT_UPLOADS_DEST,
  EVENT_FILES,
} from '../../common/constants/constants';
import { CreateEventDto } from './dto/create-event.dto';
import { FileUtilityService } from '../../config/files/utility/file-utility.service';
import { EventSerializer } from './serializers/event.serializer';
import { ConfigurationListsService } from '../configurationLists/configuration-lists.service';
import { UpdateEventDto } from './dto/update-event.dto';
import { UpdateEventTagsDto } from './dto/update-event-tags.dto';
import { UpdateEventAgeGroupsDto } from './dto/update-event-age-groups.dto';
import { RoleGuard } from '../../common/guards/role/role.guard';
import { User } from '../../common/decorators/user.decorator';
import { AuthUserType } from '../../common/types/auth-user.type';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRoleEnum } from '../userRole/enums/user-role.enum';

@UseGuards(AccessTokenGuard)
@Controller('event')
export class EventController {
  private readonly eventService: EventService;
  private readonly fileUtilityService: FileUtilityService;
  private readonly configurationListsService: ConfigurationListsService;

  constructor(
    eventService: EventService,
    fileUtilityService: FileUtilityService,
    configurationListsService: ConfigurationListsService,
  ) {
    this.eventService = eventService;
    this.fileUtilityService = fileUtilityService;
    this.configurationListsService = configurationListsService;
  }

  @Get('/show/:id')
  async showEvent(@Param('id') eventId: number) {
    const event = await this.eventService.findEvent(eventId, true);
    return EventSerializer.serialize(this.fileUtilityService, event);
  }

  @Get('/lists')
  async getCreationLists() {
    return this.configurationListsService.getEventLists();
  }

  @Post('/create')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        // Files related to event photos
        { name: 'photos' },
        // Files related to event attachments
        { name: 'attachments' },
        // File that represents cover picture
        { name: 'cover_picture', maxCount: 1 },
      ],
      {
        storage: diskStorageGenerator(`${DEFAULT_UPLOADS_DEST}${EVENT_FILES}`),
      },
    ),
  )
  async createEvent(
    @Body() data: CreateEventDto,
    @Req() req: any,
    @UploadedFiles()
    files: {
      attachments: Express.Multer.File[];
      photos: Express.Multer.File[];
      cover_picture: Express.Multer.File;
    },
  ) {
    const user = req.user;

    // prepare the payload
    const payload = {
      ...data,
      ...files,
      user,
    };

    // store the data
    const event = await this.eventService.createEvent(payload);
    return event
      ? EventSerializer.serialize(this.fileUtilityService, event)
      : null;
  }

  @Post('/update/:id')
  async updateEventData(
    @Body() data: UpdateEventDto,
    @Param('id') eventId: number,
  ) {
    data.id = eventId;
    const updated = await this.eventService.updateEventData(data);
    return EventSerializer.serialize(this.fileUtilityService, updated);
  }

  @Post('/update-tags/:id')
  async updateEventTags(
    @Body() data: UpdateEventTagsDto,
    @Param('id') eventId: number,
  ) {
    const updated = await this.eventService.updateEventTags(eventId, data);
    return EventSerializer.serialize(this.fileUtilityService, updated);
  }

  @Post('/update-age-groups/:id')
  async updateEventAgeGroups(
    @Body() data: UpdateEventAgeGroupsDto,
    @Param('id') eventId: number,
  ) {
    const updated = await this.eventService.updateEventAgeGroups(eventId, data);
    return EventSerializer.serialize(this.fileUtilityService, updated);
  }

  @Get('attendees/:id')
  getEventAttendees(@Param('id') id: string) {
    return this.eventService.getEventAttendees(+id);
  }

  @Delete('/:id/form')
  deleteEventForm(@Param('id') eventID: string) {
    return this.eventService.deleteEventForm(+eventID);
  }

  @Delete('/:id')
  @Roles(UserRoleEnum.EMPLOYEE)
  @UseGuards(AccessTokenGuard, RoleGuard)
  deleteEvent(@User() user: AuthUserType, @Param('id') id: number) {
    return this.eventService.deleteEvent(user, id);
  }
}
