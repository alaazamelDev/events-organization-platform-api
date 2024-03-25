import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { EventTag } from './entities/event-tag.entity';
import { EventPhoto } from './entities/event-photo.entity';
import { EventDay } from './entities/event-day.entity';
import { EventAttachment } from './entities/event-attachment.entity';
import { EventApprovalStatus } from './entities/event-approval-status.entity';
import { EventAgeGroup } from './entities/event-age-group.entity';
import { EventDaySlot } from './entities/event-day-slot.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Event,
      EventDay,
      EventTag,
      EventPhoto,
      EventDaySlot,
      EventAgeGroup,
      EventAttachment,
      EventApprovalStatus,
    ]),
  ],
  providers: [EventService],
  controllers: [EventController],
})
export class EventModule {}
