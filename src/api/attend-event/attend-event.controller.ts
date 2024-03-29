import { Controller, Post } from '@nestjs/common';
import { AttendEventService } from './attend-event.service';

@Controller('attend-event')
export class AttendEventController {
  constructor(private readonly attendEventService: AttendEventService) {}

  @Post()
  attendEvent() {}
}
