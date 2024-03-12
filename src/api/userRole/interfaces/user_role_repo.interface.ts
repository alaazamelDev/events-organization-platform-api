import { Repository } from 'typeorm';
import { UserRole } from '../entities/user_role.entity';

export interface IUserRoleRepository extends Repository<UserRole> {
  this: Repository<UserRole>;

  //? NOTE: HERE WE CAN DECLARE CUSTOM REPOSITORY METHODS.
  //! EXAMPLE, getRoleByName
  findRoleByName(name: string): Promise<UserRole | null>;
}
