import { Module } from '@nestjs/common';
import { FeedController } from './feed.controller';
import { FeedService } from './feed.service';

@Module({
  imports: [],
  providers: [FeedService],
  controllers: [FeedController],
})
export class FeedModule {}
