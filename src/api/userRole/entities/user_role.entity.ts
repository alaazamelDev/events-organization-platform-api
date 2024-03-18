import { BaseEntity } from '../../../common/entities/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Exclude } from 'class-transformer';

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
}
