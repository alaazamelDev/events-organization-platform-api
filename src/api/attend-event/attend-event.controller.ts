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
import { TransactionInterceptor } from '../../common/interceptors/transaction/transaction.interceptor';
import { HandleRegisterInEventsPaymentInterceptor } from './interceptors/handle-register-in-events-payment.interceptor';
import { QueryRunnerParam } from '../../common/decorators/query-runner-param.decorator';
import { QueryRunner } from 'typeorm';
import { HandleChangeAttendeeEventStatusPaymentInterceptor } from './interceptors/handle-change-attendee-event-status-payment.interceptor';

@Controller('attend-event')
export class AttendEventController {
  constructor(
    private readonly attendEventService: AttendEventService,
    private readonly manageAttendEventService: ManageAttendEventService,
  ) {}

  @Post()
  @Roles(UserRoleEnum.ATTENDEE)
  @UseGuards(AccessTokenGuard, RoleGuard)
  @UseInterceptors(
    TransactionInterceptor,
    CheckEventFormIfSubmittedInterceptor,
    CheckAttendeeBalanceAgainstEventFeesInterceptor,
    HandleRegisterInEventsPaymentInterceptor,
  )
  attendEvent(
    @QueryRunnerParam() queryRunner: QueryRunner,
    @Body() attendEventDto: AttendEventDto,
    @Req() req: Request,
  ) {
    // console.log(queryRunner);
    const user: any = req.user;
    return this.attendEventService.attendEvent(
      attendEventDto,
      +user['sub'],
      queryRunner,
    );
  }

  @Post('manage')
  // @Roles(UserRoleEnum.EMPLOYEE)
  // @UseGuards(AccessTokenGuard, RoleGuard)
  @UseInterceptors(
    TransactionInterceptor,
    CheckAttendeeBalanceAgainstEventFeesInterceptor,
    HandleChangeAttendeeEventStatusPaymentInterceptor,
  )
  changeAttendEventStatus(
    @Body() changeAttendEventStatusDto: ChangeAttendEventStatusDto,
    @QueryRunnerParam() queryRunner: QueryRunner,
  ) {
    return this.manageAttendEventService.changeAttendEventStatus(
      changeAttendEventStatusDto,
      queryRunner,
    );
  }
}
