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
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { AddPermissionDto } from './dto/add-permission.dto';
import { Employee_permissionsService } from './employee_permissions.service';
import { RemovePermissionDto } from './dto/remove-permission.dto';

@Controller('employee')
export class EmployeeController {
  constructor(
    private readonly employeeService: EmployeeService,
    private readonly employeePermissionsService: Employee_permissionsService,
  ) {}

  @Post()
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeeService.create(createEmployeeDto);
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
}
