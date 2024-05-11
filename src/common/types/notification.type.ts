import { NotificationTypeEnum } from '../entities/notification-type.enum';

export type Notification = {
  type: NotificationTypeEnum;
  data: any;
};
