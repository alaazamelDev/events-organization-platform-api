import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AdminService } from '../../api/admin/admin.service';
import { UserRole } from '../../api/userRole/entities/user_role.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly adminService: AdminService,
  ) {
    super({ passReqToCallback: true });
  }

  async validate(
    request: any,
    username: string,
    password: string,
  ): Promise<any> {
    const user = await this.authService.validateUser(
      username,
      password,
      request.body.role_id,
    );
    if (!user) {
      throw new UnauthorizedException();
    }

    // check if user is attendee, if so. check block status
    if (+request.body.role_id == +UserRole.ATTENDEE) {
      // get the attendee id...
      const attendeeId = user.attendee!.id;

      // get blocked entities
      const blockedAttendee =
        await this.adminService.isAttendeeBlocked(attendeeId);

      const isBlocked: boolean = !!blockedAttendee;
      if (isBlocked) {
        throw new ForbiddenException('You are blocked!...');
      }
    }
    return user;
  }
}
