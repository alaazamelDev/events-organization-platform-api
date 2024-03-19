import {
  PrimaryGeneratedColumn,
  ManyToOne,
  Entity,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Employee } from './employee.entity';
import { Permission } from '../../permission/entities/permission.entity';

@Entity()
@Unique(['employee', 'permission'])
export class EmployeePermission {
  @PrimaryGeneratedColumn({
    name: 'id',
    type: 'bigint',
    unsigned: true,
  })
  id: number;

  @ManyToOne(() => Employee, (employee) => employee.permissions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @ManyToOne(() => Permission, (permission) => permission)
  @JoinColumn({ name: 'permission_id' })
  permission: Permission;
}
