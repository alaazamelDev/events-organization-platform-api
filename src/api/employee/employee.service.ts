import { Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { InjectRepository } from "@nestjs/typeorm";
import { Employee } from "./entities/employee.entity";
import { User } from "../user/entities/user.entity";
import { DataSource, Repository } from "typeorm";
import { UserRole } from "../userRole/entities/user_role.entity";
import { Organization } from "../organization/entities/organization.entity";
import { Permission } from "../permission/entities/permission.entity";
import { EmployeePermission } from "./entities/employee_permission.entity";

@Injectable()
export class EmployeeService {

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    private readonly dataSource: DataSource
  ) {
  }
  async create(createEmployeeDto: CreateEmployeeDto) {

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    await queryRunner.startTransaction();
    try {
      const user = this.userRepo.create({
        username: createEmployeeDto.username,
        email: createEmployeeDto.email,
        password: createEmployeeDto.password
      });

      user.userRole = {id: 2} as UserRole;

      await queryRunner.manager.save(user);

      const employee = this.employeeRepository.create({
        first_name: createEmployeeDto.first_name,
        last_name: createEmployeeDto.last_name,
        birth_date: createEmployeeDto.birth_date,
        phone_number: createEmployeeDto.phone_number,
        user: user,
        organization: {id: createEmployeeDto.organization_id} as Organization
      });

      await queryRunner.manager.save(employee);

      const permissions = createEmployeeDto.permissions.map(p => {
        const employeePermission = new EmployeePermission();
        employeePermission.employee = employee;
        employeePermission.permission = {id: p} as Permission;

        return employeePermission;
      });

      await queryRunner.manager.save(permissions);

      await queryRunner.commitTransaction();

      return employee;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    }
  }

  findAll() {
    return `This action returns all employee`;
  }

  findOne(id: number) {
    return `This action returns a #${id} employee`;
  }

  update(id: number, _updateEmployeeDto: UpdateEmployeeDto) {
    return `This action updates a #${id} employee`;
  }

  remove(id: number) {
    return `This action removes a #${id} employee`;
  }
}
