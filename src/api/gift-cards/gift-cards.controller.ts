import { Controller, Get } from '@nestjs/common';
import { GiftCardService } from './gift-carde.service';

@Controller('gift-cards')
export class GiftCardsController {
  constructor(private readonly giftCardService: GiftCardService) {}

  @Get('generate')
  async generateGiftCardCode() {
    return this.giftCardService.generateGiftCardCode();
  }
}
