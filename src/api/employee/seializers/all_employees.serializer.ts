import { Employee } from '../entities/employee.entity';
import { Expose } from 'class-transformer';

export class AllEmployeesSerializer extends Employee {
  @Expose()
  get username() {
    return this.user.username;
  }

  constructor(partial: Partial<Employee>) {
    super();
    Object.assign(this, partial);
  }
}
