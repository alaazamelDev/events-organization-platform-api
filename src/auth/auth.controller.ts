import { Controller, Get, Post, Req, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './services/auth.service';
import { RefreshTokenGuard } from './guards/refresh-token.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UseGuards(AuthGuard('local'))
  async login(@Request() request: any) {
    console.log(request);
    return this.authService.login(request.user);
  }

  @Get('/refresh-token')
  @UseGuards(RefreshTokenGuard)
  async refreshToken(@Req() req: any) {
    const userId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
