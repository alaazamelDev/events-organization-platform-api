import { Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { AccessTokenStrategy } from '../../auth/strategies/access-token.strategy';
import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { JwtConfigService } from '../../config/secrets/jwt/config.service';
import { UserRole } from '../../api/userRole/entities/user_role.entity';

type SocketMiddleware = (socket: Socket, next: (err?: Error) => void) => void;
export const SocketAuthenticationMiddleware = (
  jwtService: JwtService,
  jwtConfigService: JwtConfigService,
): SocketMiddleware => {
  return async (socket: Socket, next) => {
    try {
      const bearerToken = socket.handshake?.headers.authorization;
      if (!bearerToken) {
        throw new UnauthorizedException('Authorization token is missing');
      }

      const token: string = bearerToken.split(' ')[1];
      let payload: any | null = null;

      try {
        payload = await jwtService.verifyAsync(token);
      } catch (error) {
        throw new UnauthorizedException('Authorization token is invalid');
      }

      const strategy = new AccessTokenStrategy(jwtConfigService);
      const user = await strategy.validate(payload);

      if (!user) {
        throw new UnauthorizedException('User does not exist');
      }

      if (+user.role_id == +UserRole.ADMIN) {
        throw new ForbiddenException(
          'You are not allowed to connect to socket.',
        );
      }

      Object.assign(socket, {
        user: user!,
      });
      next();
    } catch (error) {
      next(new UnauthorizedException('Unauthorized'));
    }
  };
};
