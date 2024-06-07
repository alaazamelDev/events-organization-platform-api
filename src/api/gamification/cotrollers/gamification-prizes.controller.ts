import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { GamificationPrizesService } from '../services/gamification-prizes.service';
import { CreateTicketsPrizeDto } from '../dto/prizes/create-tickets-prize.dto';
import { TransactionInterceptor } from '../../../common/interceptors/transaction/transaction.interceptor';
import { QueryRunnerParam } from '../../../common/decorators/query-runner-param.decorator';
import { QueryRunner } from 'typeorm';
import { UpdateTicketsPrizeDto } from '../dto/prizes/update-tickets-prize.dto';

@Controller('gamification/prizes')
export class GamificationPrizesController {
  constructor(
    private readonly gamificationPrizesService: GamificationPrizesService,
  ) {}

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
