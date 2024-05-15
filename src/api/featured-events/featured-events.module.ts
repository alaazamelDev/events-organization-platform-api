import { Module } from '@nestjs/common';
import { FeaturedEventsController } from './featured-events.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeaturedEvent } from './entities/featured-event.entity';
import { FeaturedEventType } from './entities/featured-event-type.entity';
import { FeaturedEventsService } from './featured-events.service';

@Module({
  imports: [TypeOrmModule.forFeature([FeaturedEvent, FeaturedEventType])],
  providers: [FeaturedEventsService],
  controllers: [FeaturedEventsController],
})
export class FeaturedEventsModule {}
