import {
  Controller,
  Get,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserRoleSerializer } from '../userRole/serializers/user-role.serializer';
import { AccessTokenGuard } from '../../auth/guards/access-token.guard';
import { MenuItemSerializer } from './serializers/menu-item.serializer';
import { User } from '../../common/decorators/user.decorator';
import { AuthUserType } from '../../common/types/auth-user.type';
import { UserSerializer } from './serializers/user.serializer';
import { FileUtilityService } from '../../config/files/utility/file-utility.service';

@Controller('user')
export class UserController {
  private readonly userService: UserService;
  private readonly fileUtilityService: FileUtilityService;

  constructor(
    userService: UserService,
    fileUtilityService: FileUtilityService,
  ) {
    this.userService = userService;
    this.fileUtilityService = fileUtilityService;
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

  @Get('/exchange')
  @UseGuards(AccessTokenGuard)
  async exchangeToken(@User() user: AuthUserType) {
    const userData = await this.userService.getUserWithCompleteData(user.sub);
    if (!userData) throw new UnauthorizedException('Token is Invalid');
    return UserSerializer.serialize(this.fileUtilityService, userData);
  }
}
