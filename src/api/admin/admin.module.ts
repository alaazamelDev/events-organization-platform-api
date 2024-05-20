import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { BlockedUser } from './entities/blocked-user.entity';
import { BlockedOrganization } from './entities/blocked-organization.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Admin, BlockedUser, BlockedOrganization]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
