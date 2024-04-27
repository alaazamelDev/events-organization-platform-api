import { Module } from '@nestjs/common';
import { FeedController } from './feed.controller';
import { FeedService } from './feed.service';
import { Event } from '../event/entities/event.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [],
  providers: [FeedService],
  controllers: [FeedController],
})
export class FeedModule {}
