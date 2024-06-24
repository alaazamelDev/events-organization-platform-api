import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationType } from './entities/notification-type.entity';
import { Notification } from './entities/notification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationType, Notification])],
  providers: [NotificationService],
  controllers: [NotificationController],
})
export class NotificationModule {}
