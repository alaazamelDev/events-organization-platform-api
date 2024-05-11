import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { ConfigureOrganizationsDto } from './dto/configure-organizations.dto';
import { DeleteContactInfoDto } from './dto/delete-contact-info.dto';
import { AddContactInfoDto } from './dto/add-contact-info.dto';
import { AddOrganizationAddressDto } from './dto/add-organization-address.dto';
import { DeleteOrganizationAddressDto } from './dto/delete-organization-address.dto';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { of } from 'rxjs';
import * as process from 'process';
import e from 'express';
import { AccessTokenGuard } from '../../auth/guards/access-token.guard';
import { BlockAttendeeDto } from './dto/block-attendee.dto';
import { EmployeeService } from '../employee/employee.service';
import { AttendeeService } from '../attendee/services/attendee.service';
import { FollowingAttendeeSerializer } from './serializers/following-attendee.serializer';
import { FileUtilityService } from '../../config/files/utility/file-utility.service';
import { RoleGuard } from '../../common/guards/role/role.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRoleEnum } from '../userRole/enums/user-role.enum';
import { User } from '../../common/decorators/user.decorator';
import { AuthUserType } from '../../common/types/auth-user.type';

@Controller('organization')
export class OrganizationController {
  constructor(
    private readonly organizationService: OrganizationService,
    private readonly attendeeService: AttendeeService,
    private readonly employeeService: EmployeeService,
    private readonly fileUtilityService: FileUtilityService,
  ) {}

  @Get('events')
  @Roles(UserRoleEnum.EMPLOYEE)
  @UseGuards(AccessTokenGuard, RoleGuard)
  getOrganizationEvents(@User() user: AuthUserType) {
    return this.organizationService.getOrganizationEvents(user.sub);
  }

  @Get('attendees')
  @Roles(UserRoleEnum.EMPLOYEE)
  @UseGuards(AccessTokenGuard, RoleGuard)
  getOrganizationAttendees(@User() user: AuthUserType) {
    return this.organizationService.getOrganizationAttendees(user.sub);
  }

  @Get('blacklist')
  @UseGuards(AccessTokenGuard)
  async getBlackList(@Req() req: any) {
    const userData = req.user;
    const userId = userData.sub;

    // get employee organization id,
    const employee = await this.employeeService.findByUserId(userId);
    if (!employee) {
      throw new ForbiddenException(
        "You don't have the permissions to check the blacklist!",
      );
    }

    return await this.organizationService.getOrganizationBlackList(
      employee.organization.id,
    );
  }

  @Get('is-blocked/:id')
  @UseGuards(AccessTokenGuard)
  async checkIfAttendeeIsBlocked(
    @Req() req: any,
    @Param('id') attendeeId: number,
  ) {
    const userData = req.user;
    const userId = userData.sub;

    // get employee organization id,
    const employee = await this.employeeService.findByUserId(userId);
    if (!employee) {
      throw new ForbiddenException(
        "You don't have the permissions to check the blacklist!",
      );
    }

    return await this.organizationService.checkIfAttendeeIsBlocked(
      employee.organization.id,
      attendeeId,
    );
  }

  @Get('followers-list/:id')
  @UseGuards(AccessTokenGuard)
  async getListOfOrganizationFollowers(@Param('id') organizationId: number) {
    // get the data
    const result =
      await this.organizationService.getListOfOrganizationFollowers(
        organizationId,
      );

    // serialize and return
    return FollowingAttendeeSerializer.serializeList(
      result,
      this.fileUtilityService,
    );
  }

  @Post()
  create(@Body() createOrganizationDto: CreateOrganizationDto) {
    return this.organizationService.create(createOrganizationDto);
  }

  @Post('configure')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'main_picture', maxCount: 1 },
        { name: 'cover_picture', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: './uploads/organizations/pictures',
          filename: (_req, file, cb) => {
            const filename =
              path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();

            const extension = path.parse(file.originalname).ext;

            cb(null, `${filename}${extension}`);
          },
        }),
      },
    ),
  )
  configureOrganization(
    @Body() configureOrganization: ConfigureOrganizationsDto,
    @UploadedFiles()
    files: {
      main_picture?: Express.Multer.File[];
      cover_picture?: Express.Multer.File[];
    },
  ) {
    return this.organizationService.configureOrganization(
      configureOrganization,
      files.main_picture ? files.main_picture[0].filename : '',
      files.cover_picture ? files.cover_picture[0].filename : '',
    );
  }

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  findAll() {
    return this.organizationService.findAll();
  }

  @Get(':id')
  @UseGuards(AccessTokenGuard)
  async findOne(@Param('id') id: string, @Req() req: any) {
    const userData = req.user;
    const userId = userData.sub;
    const isBlocked = await this.attendeeService.isAttendeeBlocked(+id, userId);
    if (isBlocked) {
      throw new ForbiddenException('The attendee is blocked...');
    }

    return this.organizationService.findOne(+id);
  }

  @Get('employees/:id')
  getOrganizationEmployees(@Param('id') id: number) {
    return this.organizationService.getOrganizationEmployees(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ) {
    return this.organizationService.update(+id, updateOrganizationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.organizationService.remove(+id);
  }

  @Delete('contact/:id')
  deleteContactInfo(
    @Param('id') id: string,
    @Body() deleteContactInfoDto: DeleteContactInfoDto,
  ) {
    return this.organizationService.deleteContactInfo(
      +id,
      deleteContactInfoDto,
    );
  }

  @Post('contact/:id')
  addContactInfo(
    @Param('id') id: string,
    @Body() addContactInfoDto: AddContactInfoDto,
  ) {
    return this.organizationService.addContactInfo(+id, addContactInfoDto);
  }

  @Post('address/:id')
  addOrganizationAddress(
    @Param('id') id: string,
    @Body() addOrganizationAddressDto: AddOrganizationAddressDto,
  ) {
    return this.organizationService.addOrganizationAddress(
      +id,
      addOrganizationAddressDto,
    );
  }

  @Delete('address/:id')
  deleteOrganizationAddress(
    @Param('id') id: string,
    @Body() deleteOrganizationAddressDto: DeleteOrganizationAddressDto,
  ) {
    return this.organizationService.deleteOrganizationAddress(
      +id,
      deleteOrganizationAddressDto,
    );
  }

  @Get('mainPicture/:imageName')
  getOrganizationMainPicture(
    @Param('imageName') imageName: string,
    @Res() res: any,
  ) {
    return of(
      res.sendFile(
        path.join(process.cwd(), 'uploads/organizations/pictures/' + imageName),
      ),
    );
  }

  @Get('coverPicture/:imageName')
  getOrganizationCoverPicture(
    @Param('imageName') imageName: string,
    @Res() res: any,
  ) {
    return of(
      res.sendFile(
        path.join(process.cwd(), 'uploads/organizations/pictures/' + imageName),
      ),
    );
  }

  @Post('updateCoverPicture/:id')
  @UseInterceptors(
    FileInterceptor('cover_picture', {
      storage: diskStorage({
        destination: './uploads/organizations/pictures',
        filename(
          _req: e.Request,
          file: Express.Multer.File,
          callback: (error: Error | null, filename: string) => void,
        ) {
          const filename =
            path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();

          const extension = path.parse(file.originalname).ext;

          callback(null, `${filename}${extension}`);
        },
      }),
    }),
  )
  updateOrganizationCoverPicture(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.organizationService.updateOrganizationCoverPicture(
      +id,
      file.filename,
    );
  }

  @Post('updateMainPicture/:id')
  @UseInterceptors(
    FileInterceptor('main_picture', {
      storage: diskStorage({
        destination: './uploads/organizations/pictures',
        filename(
          _req: e.Request,
          file: Express.Multer.File,
          callback: (error: Error | null, filename: string) => void,
        ) {
          const filename =
            path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();

          const extension = path.parse(file.originalname).ext;

          callback(null, `${filename}${extension}`);
        },
      }),
    }),
  )
  updateOrganizationMainPicture(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.organizationService.updateOrganizationMainPicture(
      +id,
      file.filename,
    );
  }

  @Delete('coverPicture/:id')
  removeCoverPicture(@Param('id') id: string) {
    return this.organizationService.removeOrganizationCoverPicture(+id);
  }

  @Delete('mainPicture/:id')
  removeMainPicture(@Param('id') id: string) {
    return this.organizationService.removeOrganizationMainPicture(+id);
  }

  @Post('block-attendee')
  @UseGuards(AccessTokenGuard)
  async blockAttendee(
    @Body() blockAttendeeDto: BlockAttendeeDto,
    @Req() req: any,
  ) {
    const userData = req.user;
    const employee = await this.employeeService.findByUserId(userData.sub);

    if (!employee) {
      throw new ForbiddenException('You are not allowed to make this action');
    }

    return this.organizationService.blockAttendee(blockAttendeeDto, employee);
  }

  @Post('unblock-attendee')
  @UseGuards(AccessTokenGuard)
  async unblockAttendee(
    @Body() blockAttendeeDto: BlockAttendeeDto,
    @Req() req: any,
  ) {
    const userData = req.user;
    const employee = await this.employeeService.findByUserId(userData.sub);

    if (!employee) {
      throw new ForbiddenException('You are not allowed to make this action');
    }

    const unblocked = await this.organizationService.unBlockAttendee(
      blockAttendeeDto,
      employee,
    );

    if (!unblocked) {
      throw new BadRequestException('The Attendee is not blocked.');
    }

    return true;
  }
}
