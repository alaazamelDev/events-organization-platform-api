import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './services/auth.service';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { User } from '../common/decorators/user.decorator';
import { AuthUserType } from '../common/types/auth-user.type';
import { AccessTokenGuard } from './guards/access-token.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UseGuards(AuthGuard('local'))
  async login(@Request() request: any) {
    return this.authService.login(request.user);
  }

  @Post('logout')
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@User() user: AuthUserType) {
    const isOut = await this.authService.logout(user.sub);
    return {
      message: isOut
        ? 'User Logged out successfully'
        : 'Error while logging the user out',
    };
  }

  @Get('/refresh-token')
  @UseGuards(RefreshTokenGuard)
  async refreshToken(@Req() req: any) {
    const userId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
