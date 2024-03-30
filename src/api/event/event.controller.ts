import {
  Body,
  Controller,
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
}
