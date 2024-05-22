import { Module } from '@nestjs/common';
import { FeedController } from './feed.controller';
import { FeedService } from './services/feed.service';
import { FileUtilityModule } from '../../config/files/utility/file-utility.module';
import { FeedCategoriesService } from './services/feed-categories.service';

@Module({
  imports: [FileUtilityModule],
  providers: [FeedService, FeedCategoriesService],
  controllers: [FeedController],
})
export class FeedModule {}
