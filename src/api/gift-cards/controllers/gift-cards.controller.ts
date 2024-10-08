import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  UseInterceptors,
  Param,
  Put,
} from '@nestjs/common';
import { GiftCardService } from '../services/gift-card.service';
import { TransactionInterceptor } from '../../../common/interceptors/transaction/transaction.interceptor';
import { QueryRunnerParam } from '../../../common/decorators/query-runner-param.decorator';
import { QueryRunner } from 'typeorm';
import { GenerateGiftCardsDto } from '../dto/generate-gift-cards.dto';
import { join } from 'path';
import * as process from 'process';
import { Observable, of } from 'rxjs';
import { createReadStream, unlink } from 'fs';
import { ChangeGiftCardsActiveStateDto } from '../dto/change-gift-cards-active-state.dto';

@Controller('gift-cards')
export class GiftCardsController {
  constructor(private readonly giftCardService: GiftCardService) {}

  @Get()
  async getGiftCards() {
    return this.giftCardService.getGiftCards();
  }

  @Get('download/:fileName')
  getCardsFile(
    @Param('fileName') fileName: string,
    @Res() res: any,
  ): Observable<any> {
    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename="cards.zip"',
    });

    res.flushHeaders();
    const filePath = join(process.cwd(), 'uploads/' + fileName);
    const fileStream = createReadStream(filePath);

    // fileStream.on('end', () => {
    //   unlink(filePath, (err) => {
    //     if (err) {
    //       console.error(`Error deleting file ${fileName}:`, err);
    //     } else {
    //       console.log(`File ${fileName} deleted successfully`);
    //     }
    //   });
    // });

    fileStream.pipe(res);

    return of(null);
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

  @Put('change-active-state')
  async changeGiftCardsActiveState(@Body() dto: ChangeGiftCardsActiveStateDto) {
    return this.giftCardService.changeGiftCardsActiveState(dto);
  }
}
