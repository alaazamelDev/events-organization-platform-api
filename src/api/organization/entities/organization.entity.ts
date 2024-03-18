import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { ContactOrganization } from './contact_organization.entity';
import { Employee } from '../../employee/entities/employee.entity';

@Entity({ name: 'organizations' })
export class Organization extends BaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  main_picture: string;

  @Column({ nullable: true })
  cover_picture: string;

  @OneToMany(
    () => ContactOrganization,
    (contactOrganization) => contactOrganization.organization,
  )
  contacts: ContactOrganization[];

  @OneToMany(() => Employee, (employee) => employee.organization)
  employees: Employee[];
}
