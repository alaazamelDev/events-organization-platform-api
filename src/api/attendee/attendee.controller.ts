import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AttendeeService } from './services/attendee.service';
import { RegisterAttendeeDto } from './dto/register-attendee.dto';
import { AuthService } from '../../auth/services/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { RefreshTokenGuard } from '../../auth/guards/refresh-token.guard';

@Controller('attendee')
export class AttendeeController {
  constructor(
    private readonly attendeeService: AttendeeService,
    private readonly authService: AuthService,
  ) {}

  @Post('/register')
  async registerAttendee(@Body() payload: RegisterAttendeeDto) {
    return this.attendeeService.createAttendee(payload);
  }

  @Post('/login')
  @UseGuards(AuthGuard('local'))
  async loginAttendee(@Req() request: any) {
    return this.authService.login(request.user);
  }

  @Get('/refresh-token')
  @UseGuards(RefreshTokenGuard)
  async refreshAttendeeToken(@Req() req: any) {
    const userId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
