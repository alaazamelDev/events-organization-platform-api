import { IUserRepository } from '../interfaces/user_repo.interface';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';

export const userRepository: Pick<IUserRepository, any> = {
  findByEmailAndRole(
    this: Repository<User>,
    email: string,
    user_role_id: number,
  ): Promise<User | null> {
    return this.createQueryBuilder('users')
      .where('users.user_role_id = :id', { id: user_role_id })
      .andWhere('users.email = :email', { email: email })
      .getOne();
  },

  findByUsernameAndRole(
    this: Repository<User>,
    username: string,
    user_role_id: number,
  ): Promise<User | null> {
    return this.createQueryBuilder('users')
      .where('users.user_role_id = :id', { id: user_role_id })
      .andWhere('users.username = :username', { username: username })
      .getOne();
  },
};
