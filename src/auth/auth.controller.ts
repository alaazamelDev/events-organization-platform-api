import {
  Body,
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
import { UpdateUsernameOrEmailDto } from './dto/update-username-or-email.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UseGuards(AuthGuard('local'))
  async login(@Request() request: any) {
    return this.authService.login(request.user);
  }

  @Post('update-username-or-email')
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  async updateUsernameOrEmail(
    @User() user: AuthUserType,
    @Body() payload: UpdateUsernameOrEmailDto,
  ) {
    return this.authService.updateUsernameOrEmail(user, payload);
  }

  @Post('change-password')
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @User() user: AuthUserType,
    @Body() payload: ChangePasswordDto,
  ) {
    return this.authService.changePassword(user, payload);
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
