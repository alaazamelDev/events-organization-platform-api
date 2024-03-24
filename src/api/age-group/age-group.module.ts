import { Module } from '@nestjs/common';
import { AgeGroupService } from './age-group.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgeGroup } from './entities/age-group.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AgeGroup])],
  providers: [AgeGroupService],
  exports: [AgeGroupService],
})
export class AgeGroupModule {}
