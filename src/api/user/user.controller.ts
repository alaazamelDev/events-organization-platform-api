import { Controller, Get, Req } from '@nestjs/common';
import { UserService } from './services/user.service';

@Controller('user')
export class UserController {
  private readonly userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  @Get('/menu')
  async loadUserMenu(@Req() req: any) {
    const userId: number = req.user.sub;
    const user = await this.userService.findById(userId);

    return this.userService.loadUserMenu(user!);
  }
}
