import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { Repository } from 'typeorm';
import { AddPermissionDto } from './dto/add-permission.dto';
import { EmployeePermission } from './entities/employee_permission.entity';
import { Permission } from '../permission/entities/permission.entity';
import { RemovePermissionDto } from './dto/remove-permission.dto';

@Injectable()
export class Employee_permissionsService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(EmployeePermission)
    private readonly employeePermissionRepository: Repository<EmployeePermission>,
  ) {}

  async addPermission(id: number, addPermissionDto: AddPermissionDto) {
    const employee = await this.employeeRepository.findOneOrFail({
      where: { id: id },
    });

    const employeePermission = new EmployeePermission();
    employeePermission.employee = employee;
    employeePermission.permission = {
      id: addPermissionDto.permission_id,
    } as Permission;

    await this.employeePermissionRepository.save(employeePermission, {
      reload: true,
    });

    return employeePermission;
  }

  async removePermission(id: number, removePermissionDto: RemovePermissionDto) {
    const employee = await this.employeeRepository.findOneOrFail({
      where: { id: id },
    });

    const employeePermission =
      await this.employeePermissionRepository.findOneOrFail({
        where: {
          employee: { id: employee.id } as Employee,
          permission: { id: removePermissionDto.permission_id } as Permission,
        },
        relations: { permission: true },
      });

    await this.employeePermissionRepository.delete(employeePermission);

    return employeePermission;
  }
}
