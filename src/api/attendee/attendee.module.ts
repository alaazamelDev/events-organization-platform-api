import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendee } from './entities/attendee.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Attendee])],
})
export class AttendeeModule {}
