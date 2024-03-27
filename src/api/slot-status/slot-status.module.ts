import { Module } from '@nestjs/common';
import { SlotStatusService } from './slot-status.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SlotStatus } from './entities/slot-status.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SlotStatus])],
  providers: [SlotStatusService],
})
export class SlotStatusModule {}
