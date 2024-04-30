import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AttendEventService } from './attend-event.service';
import { AttendEventDto } from './dto/attend-event.dto';
import { AccessTokenGuard } from '../../auth/guards/access-token.guard';
import { Request } from 'express';
import { ChangeAttendEventStatusDto } from './dto/change-attend-event-status.dto';
import { ManageAttendEventService } from './manage-attend-event.service';
import { CheckEventFormIfSubmittedInterceptor } from './interceptors/check-event-form-if-submitted.interceptor';
import { RoleGuard } from '../../common/guards/role/role.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRoleEnum } from '../userRole/enums/user-role.enum';
import { CheckAttendeeBalanceAgainstEventFeesInterceptor } from './interceptors/check-attendee-balance-against-event-fees.interceptor';

@Controller('attend-event')
export class AttendEventController {
  constructor(
    private readonly attendEventService: AttendEventService,
    private readonly manageAttendEventService: ManageAttendEventService,
  ) {}

  @Post()
  @Roles(UserRoleEnum.ATTENDEE)
  @UseGuards(AccessTokenGuard, RoleGuard)
  @UseInterceptors(CheckEventFormIfSubmittedInterceptor)
  @UseInterceptors(CheckAttendeeBalanceAgainstEventFeesInterceptor)
  attendEvent(@Body() attendEventDto: AttendEventDto, @Req() req: Request) {
    const user: any = req.user;
    return this.attendEventService.attendEvent(attendEventDto, +user['sub']);
  }

  @Post('manage')
  // @Roles(UserRoleEnum.EMPLOYEE)
  // @UseGuards(AccessTokenGuard, RoleGuard)
  @UseInterceptors(CheckAttendeeBalanceAgainstEventFeesInterceptor)
  changeAttendEventStatus(
    @Body() changeAttendEventStatusDto: ChangeAttendEventStatusDto,
  ) {
    return this.manageAttendEventService.changeAttendEventStatus(
      changeAttendEventStatusDto,
    );
  }
}
