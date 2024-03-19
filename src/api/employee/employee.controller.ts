import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ClassSerializerInterceptor,
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { AddPermissionDto } from './dto/add-permission.dto';
import { Employee_permissionsService } from './employee_permissions.service';
import { RemovePermissionDto } from './dto/remove-permission.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import e from 'express';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { of } from 'rxjs';
import * as process from 'process';

@Controller('employee')
export class EmployeeController {
  constructor(
    private readonly employeeService: EmployeeService,
    private readonly employeePermissionsService: Employee_permissionsService,
  ) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('profile_picture', {
      storage: diskStorage({
        destination: './uploads/employees/pictures',
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
  create(
    @Body() createEmployeeDto: CreateEmployeeDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.employeeService.create(createEmployeeDto, file?.filename);
  }

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  findAll() {
    return this.employeeService.findAll();
  }

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  findOne(@Param('id') id: string) {
    return this.employeeService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    return this.employeeService.update(+id, updateEmployeeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeeService.remove(+id);
  }

  @Post('addPermission/:id')
  addPermission(
    @Param('id') id: string,
    @Body() addPermissionDto: AddPermissionDto,
  ) {
    return this.employeePermissionsService.addPermission(+id, addPermissionDto);
  }

  @Post('removePermission/:id')
  removePermission(
    @Param('id') id: string,
    @Body() removePermissionDto: RemovePermissionDto,
  ) {
    return this.employeePermissionsService.removePermission(
      +id,
      removePermissionDto,
    );
  }

  @Get('profileImage/:imageName')
  getProfileImage(@Param('imageName') imageName: string, @Res() res: any) {
    return of(
      res.sendFile(
        path.join(process.cwd(), 'uploads/employees/pictures/' + imageName),
      ),
    );
  }
}
