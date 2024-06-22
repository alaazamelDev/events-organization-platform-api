import { Module } from '@nestjs/common';
import { GiftCardsController } from './controllers/gift-cards.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GiftCardEntity } from './entities/gift-card.entity';
import { GiftCardVariantEntity } from './entities/gift-card-variant.entity';
import { GiftCardsVariantController } from './controllers/gift-cards-variant.controller';
import { GiftCardService } from './services/gift-card.service';
import { GiftCardVariantService } from './services/gift-card-variant.service';
import { GiftCardRedeemService } from './services/gift-card-redeem.service';
import { GiftCardsRedeemController } from './controllers/gift-cards-redeem.controller';
import { AttendeeModule } from '../attendee/attendee.module';
import { AttendeesTickets } from '../payment/entities/attendees-tickets.entity';
import { GiftCardsPdfService } from './services/gift-cards-pdf.service';
import { GiftCardsSseController } from './controllers/gift-cards-sse.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      GiftCardEntity,
      GiftCardVariantEntity,
      AttendeesTickets,
    ]),
    AttendeeModule,
  ],
  providers: [
    GiftCardService,
    GiftCardVariantService,
    GiftCardRedeemService,
    GiftCardsPdfService,
  ],
  controllers: [
    GiftCardsController,
    GiftCardsVariantController,
    GiftCardsRedeemController,
    GiftCardsSseController,
  ],
  exports: [],
})
export class GiftCardsModule {}
