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
import { EmployeeModule } from '../employee/employee.module';
import { Employee } from '../employee/entities/employee.entity';
import { EmployeeService } from '../employee/employee.service';
import { User } from '../user/entities/user.entity';
import { FileUtilityModule } from '../../config/files/utility/file-utility.module';

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
      Employee,
      User,
    ]),
    EmployeeModule,
    FileUtilityModule,
  ],
  providers: [EventService, EmployeeService],
  controllers: [EventController],
})
export class EventModule {}
