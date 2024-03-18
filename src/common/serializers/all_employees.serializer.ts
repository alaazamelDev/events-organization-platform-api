import { Employee } from '../../api/employee/entities/employee.entity';
import { EmployeePermission } from '../../api/employee/entities/employee_permission.entity';
import { Exclude, Expose } from 'class-transformer';

export class AllEmployeesSerializer extends Employee {
  @Exclude()
  permissions: [EmployeePermission];

  @Expose()
  get empPass(): string {
    return this.user.password;
  }

  constructor(partial: Partial<Employee>) {
    super();
    Object.assign(this, partial);
  }
}
