import { Controller, Get, Query } from '@nestjs/common';
import { UserRoleService } from './services/user_role.service';

@Controller('services-roles')
export class UserRoleController {
  private readonly userRoleService: UserRoleService;

  constructor(userRoleService: UserRoleService) {
    this.userRoleService = userRoleService;
  }

  @Get()
  findByName(@Query('name') name: string) {
    return this.userRoleService.getRoleByName(name);
  }
}
