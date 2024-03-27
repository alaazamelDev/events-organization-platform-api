import {
  Body,
  Controller,
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

@Controller('event')
export class EventController {
  private readonly eventService: EventService;
  private readonly fileUtilityService: FileUtilityService;

  constructor(
    eventService: EventService,
    fileUtilityService: FileUtilityService,
  ) {
    this.eventService = eventService;
    this.fileUtilityService = fileUtilityService;
  }

  @Post('/create')
  @UseGuards(AccessTokenGuard)
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
}
