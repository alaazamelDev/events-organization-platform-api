import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IUserRepository } from '../interfaces/user_repo.interface';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { DataSource, IsNull, Not, QueryRunner } from 'typeorm';
import { UserRole } from '../../userRole/entities/user_role.entity';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserRoleMenuItem } from '../../userRole/entities/user-role-menu-item.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: IUserRepository,
    private readonly dataSource: DataSource,
  ) {}

  async getUserWithCompleteData(userId: number) {
    return this.userRepository.findOne({
      where: { id: userId, refreshToken: Not(IsNull()) },
      relations: {
        userRole: true,
        employee: { organization: true },
        attendee: { address: true, job: true, contacts: true },
        admin: true,
      },
    });
  }

  async loadUserMenu(user: User): Promise<UserRoleMenuItem[]> {
    const userRoleId = user.userRole.id;

    return this.dataSource.manager.find(UserRoleMenuItem, {
      where: { userRole: { id: userRoleId } },
      relations: { menuItem: { subMenuItems: true } },
      relationLoadStrategy: 'query',
    });
  }

  async revokeToken(userId: number): Promise<boolean> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (user?.refreshToken == null) {
      throw new UnauthorizedException();
    }

    const updated = await this.userRepository.update(userId, {
      refreshToken: null,
    });
    return updated.affected != undefined && updated.affected > 0;
  }

  async findOneByEmailOrUsername(
    username: string,
    queryRunner?: QueryRunner,
  ): Promise<User | null> {
    const repository =
      queryRunner?.manager.getRepository(User) ??
      this.dataSource.manager.getRepository(User);

    return repository.findOne({
      where: [{ username }, { email: username }],
      relations: {
        userRole: true,
        employee: { organization: true },
        attendee: true,
      },
      loadRelationIds: { relations: ['employee.organization'] },
      loadEagerRelations: true,
    });
  }

  async getUserRoleId(id: number): Promise<number> {
    return await this.userRepository
      .findOneOrFail({
        where: { id },
        loadRelationIds: true,
      })
      .then((user) => user.userRoleId);
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
      relations: { userRole: true, employee: { organization: true } },
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

    return (await this.findOneByEmailOrUsername(username, queryRunner))!;
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

  async getUserEmailByID(userID: number) {
    return await this.userRepository
      .findOneOrFail({
        where: { id: userID },
        select: { id: true, email: true },
      })
      .then((user) => user.email);
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
