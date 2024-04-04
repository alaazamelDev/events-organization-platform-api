import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { User } from '../user/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { UserRole } from '../userRole/entities/user_role.entity';
import { Organization } from '../organization/entities/organization.entity';
import { Permission } from '../permission/entities/permission.entity';
import { EmployeePermission } from './entities/employee_permission.entity';
import { AllEmployeesSerializer } from './seializers/all_employees.serializer';
import { hash } from 'bcrypt';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    private readonly dataSource: DataSource,
  ) {}

  async findByUserId(userId: number): Promise<Employee | null> {
    return await this.employeeRepository.findOne({
      relations: { organization: true },
      where: { user: { id: userId } },
    });
  }

  async create(createEmployeeDto: CreateEmployeeDto, imageName: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    await queryRunner.startTransaction();
    try {
      const hashedPassword = await hash(createEmployeeDto.password, 10);
      const user = this.userRepo.create({
        username: createEmployeeDto.username,
        email: createEmployeeDto.email,
        password: hashedPassword,
      });

      user.userRole = { id: 2 } as UserRole;

      await queryRunner.manager.save(user);

      const employee = this.employeeRepository.create({
        first_name: createEmployeeDto.first_name,
        last_name: createEmployeeDto.last_name,
        birth_date: createEmployeeDto.birth_date,
        phone_number: createEmployeeDto.phone_number,
        user: user,
        organization: { id: createEmployeeDto.organization_id } as Organization,
        profile_picture: imageName,
      });

      await queryRunner.manager.save(employee);

      const permissions = createEmployeeDto.permissions.map((p) => {
        const employeePermission = new EmployeePermission();
        employeePermission.employee = employee;
        employeePermission.permission = { id: p.permission_id } as Permission;

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

  async findAll() {
    return await this.employeeRepository.find({
      relations: { permissions: true, user: true },
    });
  }

  async findOne(id: number) {
    return await this.employeeRepository.findOneOrFail({
      where: { id },
      relations: { user: true, permissions: true, organization: true },
    });
  }

  async update(id: number, _updateEmployeeDto: UpdateEmployeeDto) {
    const employee = await this.employeeRepository.findOneOrFail({
      where: { id },
      relations: { user: true },
    });

    const user = await this.userRepo.findOneOrFail({
      where: { id: employee.user.id },
    });

    Object.assign(user, _updateEmployeeDto);
    Object.assign(employee, _updateEmployeeDto);

    await this.employeeRepository.save(employee);
    await this.userRepo.save(user);

    return employee;
  }

  async remove(id: number) {
    const employee = await this.employeeRepository.findOneOrFail({
      where: { id },
    });

    await this.employeeRepository.softDelete(id);

    return employee;
  }

  async removeProfilePicture(id: number) {
    const employee = await this.employeeRepository.findOneOrFail({
      where: { id },
    });

    employee.profile_picture = null;

    await this.employeeRepository.save(employee);

    return employee;
  }

  async updateProfilePicture(id: number, fileName: string | undefined) {
    const employee = await this.employeeRepository.findOneOrFail({
      where: { id },
    });

    if (fileName) {
      employee.profile_picture = fileName;

      await this.employeeRepository.save(employee);

      return employee;
    } else {
      throw new HttpException(
        'could not update the profile picture',
        HttpStatus.NOT_MODIFIED,
      );
    }
  }
}
