import { Module } from '@nestjs/common';
import { SeedingService } from './seeding.service';
import { SeedingController } from './seeding.controller';

@Module({
  imports: [],
  controllers: [SeedingController],
  providers: [SeedingService],
})
export class SeedingModule {}
