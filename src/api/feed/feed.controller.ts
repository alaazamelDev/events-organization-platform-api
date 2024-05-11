import { Controller, Get, Query } from '@nestjs/common';
import { FeedService } from './feed.service';
import { GenericFilter } from '../../common/interfaces/query.interface';

@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Get('soonEvents')
  getSoonEvents(@Query() query: GenericFilter) {
    return this.feedService.getSoonEvents(query);
  }

  @Get('organizations')
  getOrganizations(@Query() query: GenericFilter) {
    return this.feedService.getOrganizations(query);
  }

  @Get('popularEvents')
  async getPopularEvents(@Query() query: GenericFilter) {
    return this.feedService.getPopularEvents(query);
  }
}
