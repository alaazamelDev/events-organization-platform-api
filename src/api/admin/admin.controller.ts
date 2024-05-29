import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AccessTokenGuard } from '../../auth/guards/access-token.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRoleEnum } from '../userRole/enums/user-role.enum';
import { RoleGuard } from '../../common/guards/role/role.guard';
import { GenericFilter } from '../../common/interfaces/query.interface';
import { BlockedUser } from './entities/blocked-user.entity';
import { BlockedUserSerializer } from './serializers/blocked-user.serializer';
import { BlockedOrganization } from './entities/blocked-organization.entity';
import { BlockedOrganizationSerializer } from './serializers/blocked-organization.serializer';
import { FileUtilityService } from '../../config/files/utility/file-utility.service';

@Controller('admin')
@UseGuards(AccessTokenGuard, RoleGuard)
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly fileUtilityService: FileUtilityService,
  ) {}

  @Get('/attendee/is-blocked/:id')
  @Roles(UserRoleEnum.ADMIN)
  public async isAttendeeBlocked(@Param('id', ParseIntPipe) id: number) {
    const result = await this.adminService.isAttendeeBlocked(id);
    return !!result;
  }

  @Get('/organization/is-blocked/:id')
  @Roles(UserRoleEnum.ADMIN)
  public async isOrganizationBlocked(@Param('id', ParseIntPipe) id: number) {
    return !!(await this.adminService.isOrganizationBlocked(id));
  }

  @Delete('/attendee/unblock/:id')
  @Roles(UserRoleEnum.ADMIN)
  public async unBlockAttendee(@Param('id', ParseIntPipe) id: number) {
    return await this.adminService.unblockAttendee(id);
  }

  @Delete('/organization/unblock/:id')
  @Roles(UserRoleEnum.ADMIN)
  public async unBlockOrganization(@Param('id', ParseIntPipe) id: number) {
    return await this.adminService.unblockOrganization(id);
  }

  @Post('/attendee/:id')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRoleEnum.ADMIN)
  public async blockAttendee(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.blockAttendee(id);
  }

  @Post('/organization/:id')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRoleEnum.ADMIN)
  public async blockOrganization(@Param('id') id: number) {
    return this.adminService.blockOrganization(id);
  }

  @Get('/blocked-attendees')
  @Roles(UserRoleEnum.ADMIN)
  public async getListOfBlockedAttendees(@Query() query: GenericFilter) {
    const result: [BlockedUser[], number] =
      await this.adminService.getListOfBlockedAttendees(query);

    return {
      data: BlockedUserSerializer.serializeList(
        result[0],
        this.fileUtilityService,
      ),
      count: result[1],
    };
  }

  @Get('/blocked-organizations')
  @Roles(UserRoleEnum.ADMIN)
  public async getListOfBlockedOrganizations(@Query() query: GenericFilter) {
    const result: [BlockedOrganization[], number] =
      await this.adminService.getListOfBlockedOrganizations(query);
    return {
      data: BlockedOrganizationSerializer.serializeList(
        result[0],
        this.fileUtilityService,
      ),
      count: result[1],
    };
  }
}
