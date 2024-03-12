import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole } from '../entities/user_role.entity';
import { IUserRoleRepository } from '../interfaces/user_role_repo.interface';

@Injectable()
export class UserRoleService {
  constructor(
    @InjectRepository(UserRole)
    private readonly userRoleRepository: IUserRoleRepository,
  ) {}

  async getRoleByName(name: string): Promise<UserRole | null> {
    return await this.userRoleRepository.findRoleByName(name);
  }
}
