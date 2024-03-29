import { Module } from '@nestjs/common';
import { AttendEventService } from './attend-event.service';
import { AttendEventController } from './attend-event.controller';

@Module({
  controllers: [AttendEventController],
  providers: [AttendEventService],
})
export class AttendEventModule {}
