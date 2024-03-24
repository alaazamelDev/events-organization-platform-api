import { Module } from '@nestjs/common';
import { ApprovalStatusService } from './approval-status.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApprovalStatus } from './entities/approval-status.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ApprovalStatus])],
  providers: [ApprovalStatusService],
})
export class ApprovalStatusModule {}
