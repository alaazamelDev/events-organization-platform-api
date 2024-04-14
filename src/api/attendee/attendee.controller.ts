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
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AttendeeService } from './services/attendee.service';
import { RegisterAttendeeDto } from './dto/register-attendee.dto';
import { UpdateAttendeeProfileDto } from './dto/update-attendee-profile.dto';
import { ConfigurationListsService } from '../configurationLists/configuration-lists.service';
import { AccessTokenGuard } from '../../auth/guards/access-token.guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorageGenerator } from '../../config/files/disk-storage.generator';
import {
  ATTENDEE_PROFILES_STORAGE_PATH,
  DEFAULT_UPLOADS_DEST,
} from '../../common/constants/constants';
import { LocalFileInterceptor } from '../../common/interceptors/local-file.interceptor';
import * as path from 'path';
import * as fs from 'fs';
import { Request } from 'express';
import { OrganizationFollowingDto } from './dto/organization-following.dto';
import { FollowingAttendeeSerializer } from '../organization/serializers/following-attendee.serializer';

@Controller('attendee')
export class AttendeeController {
  constructor(
    private readonly configurationListsService: ConfigurationListsService,
    private readonly attendeeService: AttendeeService,
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

  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard)
  @Post('/update-profile')
  async updateAttendeeProfile(
    @Body() payload: UpdateAttendeeProfileDto,
    @Req() req: any,
  ) {
    const userId = req.user.sub;
    const attendee = await this.attendeeService.getAttendeeByUserId(userId);
    payload.id = attendee.id;
    return this.attendeeService.updateAttendeeProfile(payload);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard)
  @Post('/follow-org')
  async followOrganization(
    @Body() payload: OrganizationFollowingDto,
    @Req() req: any,
  ) {
    const userId = req.user.sub;
    const attendee = await this.attendeeService.getAttendeeByUserId(userId);
    return this.attendeeService.followOrganization(
      payload.organization_id,
      attendee.id,
    );
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard)
  @Post('/unfollow-org')
  async unfollowOrganization(
    @Body() payload: OrganizationFollowingDto,
    @Req() req: any,
  ) {
    const userId = req.user.sub;
    const attendee = await this.attendeeService.getAttendeeByUserId(userId);
    return this.attendeeService.unfollowOrganization(
      payload.organization_id,
      attendee.id,
    );
  }

  @UseGuards(AccessTokenGuard)
  @Get('/followed-organizations')
  async getListOfFollowedOrganizations(@Req() req: any) {
    const userId = req.user.sub;
    const attendee = await this.attendeeService.getAttendeeByUserId(userId);

    // get the result
    const result = await this.attendeeService.getListOfFollowedOrganizations(
      attendee.id,
    );

    // serialize and return
    return FollowingAttendeeSerializer.serializeList(result);
  }

  @UseInterceptors(
    LocalFileInterceptor({
      path: ATTENDEE_PROFILES_STORAGE_PATH,
      fieldName: 'profile_img',
    }),
  )
  @UseGuards(AccessTokenGuard)
  @Post('/update-profile/profile-image')
  async updateAttendeeProfilePicture(
    @Req() req: any,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({
          maxSize: 2 * Math.pow(2, 20),
          message: 'File Size cannot be greater than 2MB',
        })
        .build({ fileIsRequired: true }),
    )
    profileImg: Express.Multer.File,
  ) {
    // remove the old one.
    const userId = req.user.sub;
    const attendee = await this.attendeeService.getAttendeeByUserId(userId);

    // if there is an old file, delete it.
    if (attendee.profilePictureUrl) {
      // get the file name from the link
      const splitFileName: string[] = attendee.profilePictureUrl.split('/');
      const fileName: string = splitFileName.at(splitFileName.length - 1)!;

      // delete the old file
      this.deleteAttendeeFile(fileName);
    }

    // update the attendee record with new file path.
    const updatedData = {
      id: attendee.id,
      profile_img: `${ATTENDEE_PROFILES_STORAGE_PATH}/${profileImg.filename}`,
    };

    return this.attendeeService.updateAttendeeProfile(updatedData);
  }

  @UseInterceptors(
    LocalFileInterceptor({
      path: ATTENDEE_PROFILES_STORAGE_PATH,
      fieldName: 'cover_img',
    }),
  )
  @UseGuards(AccessTokenGuard)
  @Post('/update-profile/cover-image')
  async updateAttendeeCoverPicture(
    @Req() req: any,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({
          maxSize: 2 * Math.pow(2, 20),
          message: 'File Size cannot be greater than 2MB',
        })
        .build({ fileIsRequired: true }),
    )
    coverImg: Express.Multer.File,
  ) {
    // remove the old one.
    const userId = req.user.sub;
    const attendee = await this.attendeeService.getAttendeeByUserId(userId);

    // if there is an old file, delete it.
    if (attendee.coverPictureUrl) {
      // get the file name from the link
      const splitFileName: string[] = attendee.coverPictureUrl.split('/');
      const fileName: string = splitFileName.at(splitFileName.length - 1)!;

      // delete the old file
      this.deleteAttendeeFile(fileName);
    }

    // update the attendee record with new file path.
    const updatedData = {
      id: attendee.id,
      cover_img: `${ATTENDEE_PROFILES_STORAGE_PATH}/${coverImg.filename}`,
    };

    console.log(updatedData);
    return this.attendeeService.updateAttendeeProfile(updatedData);
  }

  @Get('my-profile')
  @UseGuards(AccessTokenGuard)
  async getMyProfileDetails(@Req() req: any) {
    const userId = req.user.sub;
    const attendee = await this.attendeeService.getAttendeeByUserId(userId);
    return this.attendeeService.getAttendeeDetails(attendee.id);
  }

  private deleteAttendeeFile(fileName: string): boolean {
    const filePath = path.join(
      DEFAULT_UPLOADS_DEST,
      ATTENDEE_PROFILES_STORAGE_PATH,
      fileName,
    );

    // Check if the file exists before attempting to delete
    if (fs.existsSync(filePath)) {
      try {
        // Delete the file
        fs.unlinkSync(filePath);
        return true;
      } catch (error) {
        console.error('Error deleting file:', error);
      }
    } else {
      console.log('File does not exist:', filePath);
    }
    return false;
  }

  @Get('events')
  @UseGuards(AccessTokenGuard)
  getAttendeeEvents(@Req() req: Request) {
    const user: any = req.user;

    return this.attendeeService.getAttendeeEvents(+user['sub']);
  }
}
