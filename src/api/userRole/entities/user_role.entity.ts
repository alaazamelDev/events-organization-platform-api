import { BaseEntity } from '../../../common/entities/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Exclude } from 'class-transformer';
import { UserRoleMenuItem } from './user-role-menu-item.entity';

@Entity('user_roles')
export class UserRole extends BaseEntity {
  static ADMIN: number = 1;
  static EMPLOYEE: number = 2;
  static ATTENDEE: number = 3;

  @Column({
    name: 'role_name',
    type: 'varchar',
  })
  roleName!: string;

  @OneToMany(() => User, (user) => user.userRole)
  users!: User[];

  @Exclude()
  updatedAt: Date;

  @Exclude()
  deletedAt: Date;

  @Exclude()
  createdAt: Date;

  // add the new relation. (user role menu items)
  @OneToMany(() => UserRoleMenuItem, (item) => item.userRole)
  roleMenuItems: UserRoleMenuItem[];
}
