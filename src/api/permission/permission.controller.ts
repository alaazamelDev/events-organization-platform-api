import {
  Controller,
  Get,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { PermissionsService } from './permissions.service';

@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  findAll() {
    return this.permissionsService.getPermissions();
  }
}
