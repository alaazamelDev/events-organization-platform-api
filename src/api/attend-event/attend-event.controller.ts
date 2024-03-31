import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AttendEventService } from './attend-event.service';
import { AttendEventDto } from './dto/attend-event.dto';
import { AccessTokenGuard } from '../../auth/guards/access-token.guard';
import { Request } from 'express';
import { ChangeAttendEventStatusDto } from './dto/change-attend-event-status.dto';
import { ManageAttendEventService } from './manage-attend-event.service';

@Controller('attend-event')
export class AttendEventController {
  constructor(
    private readonly attendEventService: AttendEventService,
    private readonly manageAttendEventService: ManageAttendEventService,
  ) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  attendEvent(@Body() attendEventDto: AttendEventDto, @Req() req: Request) {
    const user: any = req.user;
    return this.attendEventService.attendEvent(attendEventDto, +user['sub']);
  }

  @Post('manage')
  changeAttendEventStatus(
    @Body() changeAttendEventStatusDto: ChangeAttendEventStatusDto,
  ) {
    return this.manageAttendEventService.changeAttendEventStatus(
      changeAttendEventStatusDto,
    );
  }
}
