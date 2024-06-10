import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { GamificationPrizesService } from '../services/gamification-prizes.service';
import { CreateTicketsPrizeDto } from '../dto/prizes/create-tickets-prize.dto';
import { TransactionInterceptor } from '../../../common/interceptors/transaction/transaction.interceptor';
import { QueryRunnerParam } from '../../../common/decorators/query-runner-param.decorator';
import { QueryRunner } from 'typeorm';
import { UpdateTicketsPrizeDto } from '../dto/prizes/update-tickets-prize.dto';
import { RedeemPrizeDto } from '../dto/prizes/redeem-prize.dto';
import { CheckAttendeeRpBalanceAgainstPrizeInterceptor } from '../interceptors/check-attendee-rp-balance-against-prize.interceptor';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRoleEnum } from '../../userRole/enums/user-role.enum';
import { AccessTokenGuard } from '../../../auth/guards/access-token.guard';
import { RoleGuard } from '../../../common/guards/role/role.guard';
import { User } from '../../../common/decorators/user.decorator';
import { AuthUserType } from '../../../common/types/auth-user.type';

@Controller('gamification/prizes')
export class GamificationPrizesController {
  constructor(
    private readonly gamificationPrizesService: GamificationPrizesService,
  ) {}

  @Get()
  async getPrizes() {
    return await this.gamificationPrizesService.getPrizes();
  }

  @Post('redeem')
  @Roles(UserRoleEnum.ATTENDEE)
  @UseGuards(AccessTokenGuard, RoleGuard)
  @UseInterceptors(
    TransactionInterceptor,
    CheckAttendeeRpBalanceAgainstPrizeInterceptor,
  )
  async redeemPrize(
    @Body() redeemPrizeDto: RedeemPrizeDto,
    @User() user: AuthUserType,
    @QueryRunnerParam() queryRunner: QueryRunner,
  ) {
    return this.gamificationPrizesService.redeemPrize(
      redeemPrizeDto,
      +user.sub,
      queryRunner,
    );
  }

  @Get('tickets-prize')
  async getTicketsPrizes() {
    return this.gamificationPrizesService.getTicketsPrizes();
  }

  @Post('tickets-prize')
  @UseInterceptors(TransactionInterceptor)
  async createTicketsPrize(
    @Body() createTicketsPrizeDto: CreateTicketsPrizeDto,
    @QueryRunnerParam() queryRunner: QueryRunner,
  ) {
    return this.gamificationPrizesService.createTicketsPrize(
      createTicketsPrizeDto,
      queryRunner,
    );
  }

  @Put('tickets-prize')
  @UseInterceptors(TransactionInterceptor)
  async updateTicketsPrize(
    @Body() updateTicketsPrizeDto: UpdateTicketsPrizeDto,
    @QueryRunnerParam() queryRunner: QueryRunner,
  ) {
    return this.gamificationPrizesService.updateTicketsPrize(
      updateTicketsPrizeDto,
      queryRunner,
    );
  }
}
