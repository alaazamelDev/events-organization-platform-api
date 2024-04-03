import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { EventDayService } from './event-day.service';
import { CreateEventDayRequest } from './dto/create-event-day.request';
import { UpdateEventDayRequest } from './dto/update-event-day.request';

@Controller('event-day')
export class EventDayController {
  constructor(private readonly eventDayService: EventDayService) {}

  @Post()
  create(@Body() createEventDayDto: CreateEventDayRequest) {
    return this.eventDayService.create(createEventDayDto);
  }

  @Get()
  findAll() {
    return this.eventDayService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventDayService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEventDayDto: UpdateEventDayRequest,
  ) {
    return this.eventDayService.update(+id, updateEventDayDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventDayService.remove(+id);
  }
}
