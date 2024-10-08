import { BaseEntity } from '../../../common/entities/base.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  RelationId,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Organization } from '../../organization/entities/organization.entity';
import { EmployeePermission } from './employee_permission.entity';

@Entity({ name: 'employees' })
export class Employee extends BaseEntity {
  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  phone_number: string;

  @Column({ nullable: true, type: 'text' })
  profile_picture!: string | null;

  @Column()
  birth_date: Date;

  @ManyToOne(() => Organization, (organization) => organization.employees)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @RelationId((employee: Employee) => employee.organization, 'organization_id')
  organizationId?: number;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @RelationId((employee: Employee) => employee.user, 'user_id')
  userId?: number;

  @OneToMany(
    () => EmployeePermission,
    (employeePermission) => employeePermission.employee,
  )
  permissions: EmployeePermission[];

  // constructor(partial: Partial<Employee>) {
  //   super();
  //   Object.assign(this, partial);
  // }
}
