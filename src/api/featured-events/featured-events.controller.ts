import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { FeaturedEventsService } from './featured-events.service';
import { CreateFeaturedEventDto } from './dto/create-featured-event.dto';

@Controller('featured-events')
export class FeaturedEventsController {
  constructor(private readonly featuredEventsService: FeaturedEventsService) {}

  @Get()
  getFeaturedEvents() {
    return this.featuredEventsService.getFeaturedEvents();
  }

  @Post()
  createFeaturedEvent(@Body() createFeaturedEventDto: CreateFeaturedEventDto) {
    return this.featuredEventsService.createFeaturedEvent(
      createFeaturedEventDto,
    );
  }

  @Delete('/:id')
  deleteFeaturedEvent(@Param('id') featuredEventID: string) {
    return this.featuredEventsService.deleteFeaturedEvent(+featuredEventID);
  }
}
