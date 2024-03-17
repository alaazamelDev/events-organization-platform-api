import { BaseEntity } from "../../../common/entities/base.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, JoinTable, OneToMany } from "typeorm";
import { User } from "../../user/entities/user.entity";
import { Organization } from "../../organization/entities/organization.entity";
import { EmployeePermission } from "./employee_permission.entity";
@Entity()
export class Employee extends BaseEntity {

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  phone_number: string;

  @Column({nullable: true})
  profile_picture: string;

  @Column()
  birth_date: Date;

  @ManyToOne(() => Organization,
    (organization) => organization.employees)
  @JoinColumn({name: 'organization_id'})
  organization: Organization;

  @OneToOne(() => User)
  @JoinColumn({name: 'user_id'})
  user: User;

  @OneToMany(() => EmployeePermission, employeePermission => employeePermission.employee)
  permissions: EmployeePermission[];
}
