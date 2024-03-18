import { BaseEntity } from '../../../common/entities/base.entity';
import { Column, Entity, OneToMany } from "typeorm";
import { ContactOrganization } from "../../organization/entities/contact_organization.entity";
import { EmployeePermission } from "../../employee/entities/employee_permission.entity";
@Entity()
export class Permission extends BaseEntity {
  @Column()
  name: string;

  @OneToMany(() => EmployeePermission, employeePermission => employeePermission.permission)
  employees: EmployeePermission[];
}
