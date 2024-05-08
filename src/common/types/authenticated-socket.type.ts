import { Socket } from 'socket.io';
import { AuthUserType } from './auth-user.type';

export type AuthenticatedSocketType = Socket & {
  user: AuthUserType;
};
