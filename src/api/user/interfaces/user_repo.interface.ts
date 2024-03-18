import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';

export interface IUserRepository extends Repository<User> {
  this: Repository<User>;

  findByEmailAndRole(
    email: string,
    user_role_id: number,
  ): Promise<User | undefined>;

  findByUsernameAndRole(
    username: string,
    user_role_id: number,
  ): Promise<User | undefined>;
}
