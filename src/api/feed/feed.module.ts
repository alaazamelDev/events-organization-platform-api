import { Module } from '@nestjs/common';
import { FeedController } from './feed.controller';
import { FeedService } from './feed.service';
import { FileUtilityModule } from '../../config/files/utility/file-utility.module';

@Module({
  imports: [FileUtilityModule],
  providers: [FeedService],
  controllers: [FeedController],
})
export class FeedModule {}
