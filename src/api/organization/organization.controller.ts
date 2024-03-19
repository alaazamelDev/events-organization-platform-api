import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  Res,
  UploadedFile,
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

@Controller('organization')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

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
  findAll() {
    return this.organizationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
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
}
