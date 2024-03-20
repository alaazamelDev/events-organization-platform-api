import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  ParseIntPipe,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AttendeeService } from './services/attendee.service';
import { RegisterAttendeeDto } from './dto/register-attendee.dto';
import { AuthService } from '../../auth/services/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { RefreshTokenGuard } from '../../auth/guards/refresh-token.guard';
import { LocalFileInterceptor } from '../../common/interceptors/local-file.interceptor';
import { UpdateAttendeeProfileDto } from './dto/update-attendee-profile.dto';
import { ATTENDEE_PROFILES_STORAGE_PATH } from '../../common/constants/constants';

@Controller('attendee')
export class AttendeeController {
  constructor(
    private readonly attendeeService: AttendeeService,
    private readonly authService: AuthService,
  ) {}

  @Post('/register')
  @UseInterceptors(
    LocalFileInterceptor({
      fieldName: 'profile_img',
      path: ATTENDEE_PROFILES_STORAGE_PATH,
    }),
  )
  async registerAttendee(
    @Body() payload: RegisterAttendeeDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({
          maxSize: 2 * Math.pow(2, 20),
          message: 'File size should be less than or equal to 2MB',
        }) // 2MB MAX
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          fileIsRequired: false,
        }),
    )
    profileImg: Express.Multer.File,
  ) {
    const imagePath = `${ATTENDEE_PROFILES_STORAGE_PATH}/${profileImg.filename}`;
    return this.attendeeService.createAttendee({
      ...payload,
      profile_img: imagePath,
    });
  }

  @Get('profile/:id')
  async getAttendeeProfileDetails(@Param('id') id: number) {
    return this.attendeeService.getAttendeeDetails(id);
  }

  @Post('/update-profile/:id')
  @HttpCode(HttpStatus.OK)
  async updateAttendeeProfile(
    @Param('id', new ParseIntPipe())
    attendeeId: number,
    @Body()
    payload: UpdateAttendeeProfileDto,
  ) {
    payload.id = attendeeId;
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
}
