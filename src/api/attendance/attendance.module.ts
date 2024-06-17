import { Module } from '@nestjs/common';
import { AttendanceService } from './services/attendance.service';
import { AttendanceController } from './attendance.controller';
import { QrCodeService } from './services/qrcode.service';

@Module({
  providers: [AttendanceService, QrCodeService],
  controllers: [AttendanceController],
  exports: [QrCodeService],
})
export class AttendanceModule {}
