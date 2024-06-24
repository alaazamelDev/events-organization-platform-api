import { Reflector } from '@nestjs/core';

export const NotificationTypes = Reflector.createDecorator<number>();
