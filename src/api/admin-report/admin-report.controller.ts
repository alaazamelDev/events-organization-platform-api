import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AdminReportService } from './admin-report.service';
import { FileUtilityService } from '../../config/files/utility/file-utility.service';
import { AccessTokenGuard } from '../../auth/guards/access-token.guard';
import { RoleGuard } from '../../common/guards/role/role.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRoleEnum } from '../userRole/enums/user-role.enum';
import { User } from '../../common/decorators/user.decorator';
import { AuthUserType } from '../../common/types/auth-user.type';
import { CreateAdminReportDto } from './dto/create-admin-report.dto';
import { AdminReportSerializer } from './serializers/admin-report.serializer';

@Controller('admin-report')
export class AdminReportController {
  constructor(
    private readonly service: AdminReportService,
    private readonly fileUtilityService: FileUtilityService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard, RoleGuard)
  @Roles(UserRoleEnum.ATTENDEE)
  async create(
    @User() user: AuthUserType,
    @Body() payload: CreateAdminReportDto,
  ) {
    const completePayload = { ...payload, reporter_id: user.sub };
    const result = await this.service.createReport(completePayload);
    return AdminReportSerializer.serialize(result, this.fileUtilityService);
  }
}
