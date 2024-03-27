import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { EmployeePermission } from './entities/employee_permission.entity';
import { User } from '../user/entities/user.entity';
import { Employee_permissionsService } from './employee_permissions.service';

@Module({
  imports: [TypeOrmModule.forFeature([Employee, EmployeePermission, User])],
  controllers: [EmployeeController],
  providers: [EmployeeService, Employee_permissionsService],
  exports: [EmployeeService],
})
export class EmployeeModule {}
