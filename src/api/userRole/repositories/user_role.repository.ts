import { IUserRoleRepository } from '../interfaces/user_role_repo.interface';
import { UserRole } from '../entities/user_role.entity';
import { Repository } from 'typeorm';

export const userRoleRepository: Pick<IUserRoleRepository, any> = {
  //? NOTE: HERE WE CAN IMPLEMENT THE DECLARED REPO METHODS
  findRoleByName(
    this: Repository<UserRole>,
    name: string,
  ): Promise<UserRole | null> {
    return this.findOneBy({ roleName: name });
  },
};
