import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IUserRepository } from '../interfaces/user_repo.interface';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { QueryRunner } from 'typeorm';
import { UserRole } from '../../userRole/entities/user_role.entity';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: IUserRepository,
  ) {}

  async loadUserMenu(user: User) {
    const userRoleId = user.userRole.id;

    switch (userRoleId) {
      case UserRole.ATTENDEE:
        break;

      case UserRole.EMPLOYEE:
        break;
    }
  }

  async findOneByEmailOrUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: [{ username }, { email: username }],
    });
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
      relations: { userRole: true },
    });
  }

  async createUser(
    createUserDto: CreateUserDto,
    queryRunner?: QueryRunner,
  ): Promise<User> {
    // check for duplication
    const { email, username } = createUserDto;
    let existingUser = await this.findUserByEmail(email);

    if (existingUser) {
      throw new HttpException(
        'User with email {' + createUserDto.email + '} is already exist!',
        HttpStatus.BAD_REQUEST,
      );
    }

    existingUser = await this.findUserByUsername(username);

    if (existingUser) {
      throw new HttpException(
        'User with username {' + createUserDto.username + '} is already exist!',
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = this.userRepository.create(createUserDto);
    user.userRole = { id: createUserDto.role_id } as UserRole;

    if (queryRunner) {
      await queryRunner.manager.save(user, { reload: true });
    } else {
      await this.userRepository.save(user, { reload: true });
    }

    return user;
  }

  async updateUser(updateUserDto: UpdateUserDto, queryRunner?: QueryRunner) {
    let user: User | null;

    if (queryRunner) {
      user = await queryRunner.manager.findOneBy(User, {
        id: updateUserDto.id,
      });
    } else {
      user = await this.userRepository.findOneBy({ id: updateUserDto.id });
    }

    if (!user) {
      throw new HttpException(
        'User with ID=' + updateUserDto.id + ' Was not found!',
        HttpStatus.NOT_FOUND,
      );
    }

    if (queryRunner) {
      return queryRunner.manager.update(User, updateUserDto.id, updateUserDto);
    }

    return this.userRepository.update(updateUserDto.id, updateUserDto);
  }

  private async findUserByEmail(email: string) {
    return await this.userRepository
      .createQueryBuilder('users')
      .where('users.email = :email', { email: email })
      .getOne();
  }

  private async findUserByUsername(username: string) {
    return await this.userRepository
      .createQueryBuilder('users')
      .where('users.username = :username', { username: username })
      .getOne();
  }
}
