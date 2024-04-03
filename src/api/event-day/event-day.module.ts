import { Module } from '@nestjs/common';
import { EventDayService } from './event-day.service';
import { EventDayController } from './event-day.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventDay } from './entities/event-day.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EventDay])],
  controllers: [EventDayController],
  providers: [EventDayService],
})
export class EventDayModule {}
