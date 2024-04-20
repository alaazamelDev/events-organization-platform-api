import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserRoleSerializer } from '../userRole/serializers/user-role.serializer';
import { AccessTokenGuard } from '../../auth/guards/access-token.guard';
import { MenuItemSerializer } from './serializers/menu-item.serializer';

@Controller('user')
export class UserController {
  private readonly userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  @Get('/menu')
  @UseGuards(AccessTokenGuard)
  async loadUserMenu(@Req() req: any) {
    const userId: number = req.user.sub;
    const user = await this.userService.findById(userId);
    const userRole = user!.userRole;

    const data = await this.userService.loadUserMenu(user!);
    console.log(data);
    const menuItems = data.map((item) => item.menuItem);
    return {
      ...UserRoleSerializer.serialize(userRole),
      menu: MenuItemSerializer.serializeList(menuItems),
    };
  }
}
