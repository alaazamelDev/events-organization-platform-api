import { Module } from '@nestjs/common';
import { GiftCardService } from './gift-carde.service';
import { GiftCardsController } from './gift-cards.controller';

@Module({
  imports: [],
  providers: [GiftCardService],
  controllers: [GiftCardsController],
  exports: [],
})
export class GiftCardsModule {}
