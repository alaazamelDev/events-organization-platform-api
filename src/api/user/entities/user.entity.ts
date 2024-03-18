import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { UserRole } from '../../userRole/entities/user_role.entity';
import { Exclude } from 'class-transformer';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @Column({
    name: 'username',
    type: 'varchar',
    unique: true,
  })
  username!: string;

  @Column({
    name: 'email',
    type: 'varchar',
    unique: true,
  })
  email!: string;

  @Column({
    name: 'password',
    type: 'varchar',
  })
  @Exclude()
  password!: string;

  @ManyToOne(() => UserRole, (role) => role.users, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @Column({
    name: 'user_role_id',
    type: 'bigint',
    unsigned: true,
  })
  @JoinColumn({ name: 'user_role_id' })
  userRole!: UserRole;

  @Column({
    name: 'refresh_token',
    nullable: true,
    type: 'varchar',
  })
  refreshToken?: string;
}
