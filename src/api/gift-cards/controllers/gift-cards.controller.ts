import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  Sse,
  StreamableFile,
  UseInterceptors,
  MessageEvent,
} from '@nestjs/common';
import { GiftCardService } from '../services/gift-card.service';
import { TransactionInterceptor } from '../../../common/interceptors/transaction/transaction.interceptor';
import { QueryRunnerParam } from '../../../common/decorators/query-runner-param.decorator';
import { QueryRunner } from 'typeorm';
import { GenerateGiftCardsDto } from '../dto/generate-gift-cards.dto';
import { createReadStream } from 'fs';
import { join } from 'path';
import * as process from 'process';
import { Response } from 'express';
import { interval, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Controller('gift-cards')
export class GiftCardsController {
  constructor(private readonly giftCardService: GiftCardService) {}

  @Get()
  async getGiftCards() {
    return this.giftCardService.getGiftCards();
  }

  @Get('download')
  getFile(@Res({ passthrough: true }) res: Response): StreamableFile {
    const file = createReadStream(
      join(process.cwd(), 'cards-27bd2510-2e85-11ef-8498-e7718a14f31a.zip'),
    );
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="cards.zip"`,
    });
    return new StreamableFile(file);
  }

  @Get('print')
  async printCards() {
    return await this.giftCardService.printCards();
  }

  @Post('generate')
  @UseInterceptors(TransactionInterceptor)
  async generateGiftCards(
    @Body() generateGiftCardsDto: GenerateGiftCardsDto,
    @QueryRunnerParam() queryRunner: QueryRunner,
  ) {
    return this.giftCardService.generateGiftCards(
      generateGiftCardsDto,
      queryRunner,
    );
  }
}
