import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AttendeeService } from './services/attendee.service';
import { RegisterAttendeeDto } from './dto/register-attendee.dto';
import { AuthService } from '../../auth/services/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { RefreshTokenGuard } from '../../auth/guards/refresh-token.guard';
import { UpdateAttendeeProfileDto } from './dto/update-attendee-profile.dto';
import { ConfigurationListsService } from '../configurationLists/configuration-lists.service';
import { AccessTokenGuard } from '../../auth/guards/access-token.guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorageGenerator } from '../../config/files/disk-storage.generator';
import {
  ATTENDEE_PROFILES_STORAGE_PATH,
  DEFAULT_UPLOADS_DEST,
} from '../../common/constants/constants';

@Controller('attendee')
export class AttendeeController {
  constructor(
    private readonly configurationListsService: ConfigurationListsService,
    private readonly attendeeService: AttendeeService,
    private readonly authService: AuthService,
  ) {}

  @Post('/register')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'profile_img', maxCount: 1 },
        { name: 'cover_img', maxCount: 1 },
      ],
      {
        storage: diskStorageGenerator(
          `${DEFAULT_UPLOADS_DEST}${ATTENDEE_PROFILES_STORAGE_PATH}`,
        ),
      },
    ),
  )
  async registerAttendee(
    @Body() payload: RegisterAttendeeDto,
    @UploadedFiles(
      new ParseFilePipeBuilder().build({
        fileIsRequired: false,
        errorHttpStatusCode: HttpStatus.BAD_REQUEST,
      }),
    )
    files: {
      profile_img?: Express.Multer.File[];
      cover_img?: Express.Multer.File[];
    },
  ) {
    const profileImg = files.profile_img?.at(0);
    if (profileImg) {
      // profile image is passed
      payload.profile_img = `${ATTENDEE_PROFILES_STORAGE_PATH}/${profileImg.filename}`;
    }

    const coverImg = files.cover_img?.at(0);
    if (coverImg) {
      // cover image is passed
      payload.cover_img = `${ATTENDEE_PROFILES_STORAGE_PATH}/${coverImg.filename}`;
    }

    return this.attendeeService.createAttendee(payload);
  }

  @Get('lists')
  async loadConfigurationLists() {
    return this.configurationListsService.getAttendeeLists();
  }

  @Get('profile/:id')
  async getAttendeeProfileDetails(@Param('id') id: number) {
    return this.attendeeService.getAttendeeDetails(id);
  }

  @Post('/update-profile')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard)
  async updateAttendeeProfile(
    @Body() payload: UpdateAttendeeProfileDto,
    @Req() req: any,
  ) {
    const userId = req.user.sub;
    const attendee = await this.attendeeService.getAttendeeByUserId(userId);
    payload.id = attendee.id;
    return this.attendeeService.updateAttendeeProfile(payload);
  }

  @Post('/login')
  @UseGuards(AuthGuard('local'))
  async loginAttendee(@Req() request: any) {
    return this.authService.login(request.user);
  }

  @Get('/refresh-token')
  @UseGuards(RefreshTokenGuard)
  async refreshAttendeeToken(@Req() req: any) {
    const userId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];
    return this.authService.refreshTokens(userId, refreshToken);
  }

  @Get('my-profile')
  @UseGuards(AccessTokenGuard)
  async getMyProfileDetails(@Req() req: any) {
    const userId = req.user.sub;
    const attendee = await this.attendeeService.getAttendeeByUserId(userId);
    return this.attendeeService.getAttendeeDetails(attendee.id);
  }
}
