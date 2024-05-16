import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { UserService } from '../../api/user/services/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../api/user/entities/user.entity';
import * as uuid from 'uuid';
import { compare, hash } from 'bcrypt';
import { DataSource, QueryRunner } from 'typeorm';
import { UserRole } from '../../api/userRole/entities/user_role.entity';
import { AuthUserType } from '../../common/types/auth-user.type';
import { UpdateUsernameOrEmailDto } from '../dto/update-username-or-email.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { FileUtilityService } from '../../config/files/utility/file-utility.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly fileUtilityService: FileUtilityService,
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    private readonly datasource: DataSource,
  ) {}

  async validateUser(
    username: string,
    pass: string,
    roleId?: number,
  ): Promise<User | null> {
    if (!roleId) {
      throw new BadRequestException('Role Id is required');
    }
    const user: User | null =
      await this.usersService.findOneByEmailOrUsername(username);
    if (user && +user.userRole.id == roleId) {
      const passwordMatch = await compare(pass, user.password);

      if (passwordMatch) {
        return user;
      }
    }

    return null;
  }

  async logout(userId: number) {
    return this.usersService.revokeToken(userId);
  }

  async login(user: User) {
    const accessToken = await this.createAccessToken(user);
    const refreshToken = await this.createRefreshToken(user);

    // update the refresh token.
    await this.updateUserRefreshToken(user.id, refreshToken);

    const profilePicture: string | undefined | null =
      user.userRole.id == +UserRole.ATTENDEE
        ? user.attendee?.profilePictureUrl
        : user.userRole.id == +UserRole.EMPLOYEE
        ? user.employee?.profile_picture
        : user.admin?.profilePictureUrl;

    // return the result
    return {
      user_id: user.id,
      username: user.username,
      user_role: user.userRole.id,
      attendee_id:
        user.userRole.id == UserRole.ATTENDEE ? user.attendee?.id : undefined,
      organization_id:
        user.userRole.id == UserRole.EMPLOYEE
          ? user.employee?.organizationId
          : undefined,
      profile_picture: this.fileUtilityService.getFileUrl(profilePicture),
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async changePassword(userAuth: AuthUserType, payload: ChangePasswordDto) {
    // get the given role id
    const roleId = payload.role_id;

    // Query the user.
    const user: User | null = await this.datasource
      .getRepository(User)
      .findOne({
        where: {
          id: +userAuth.sub,
        },
        relations: {
          userRole: true,
        },
      });

    if (+user?.userRole.id! != +roleId) {
      throw new BadRequestException('role_id is not matching');
    }

    // Check if the password is matching.
    const passwordMatch = await compare(payload.old_password, user!.password);
    if (!passwordMatch) {
      throw new BadRequestException('Wrong password was provided!');
    }

    // hash the password
    const hashedPassword = await hash(payload.new_password, 10);

    // update the password
    await this.datasource
      .getRepository(User)
      .update(userAuth.sub, { password: hashedPassword });
    const updatedUser = await this.usersService.findOneByEmailOrUsername(
      user?.username!,
    );
    return this.login(updatedUser!);
  }

  async updateUsernameOrEmail(
    userAuth: AuthUserType,
    payload: UpdateUsernameOrEmailDto,
  ) {
    if (!payload.new_username && !payload.new_email) {
      throw new BadRequestException(
        'You must specify the new email or username',
      );
    }

    //
    const roleId = payload.role_id;

    // Query the user.
    const user: User | null = await this.datasource
      .getRepository(User)
      .findOne({
        where: {
          id: +userAuth.sub,
        },
        relations: {
          userRole: true,
        },
      });

    if (+user?.userRole.id! != +roleId) {
      throw new BadRequestException('role_id is not matching');
    }

    // Check if the password is matching.
    const passwordMatch = await compare(payload.password, user!.password);
    if (!passwordMatch) {
      throw new BadRequestException('Wrong password was provided!');
    }

    let updatedUser = null;
    if (payload.new_username) {
      // update the username
      await this.datasource
        .getRepository(User)
        .update(userAuth.sub, { username: payload.new_username });
      updatedUser = await this.usersService.findOneByEmailOrUsername(
        payload.new_username,
      );
    }

    if (payload.new_email) {
      // update the email
      await this.datasource
        .getRepository(User)
        .update(userAuth.sub, { email: payload.new_email });
      updatedUser = await this.usersService.findOneByEmailOrUsername(
        payload.new_email,
      );
    }

    return this.login(updatedUser!);
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.usersService.findById(+userId);
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');
    const refreshTokenMatches = await compare(refreshToken, user.refreshToken);
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const access = await this.createAccessToken(user);
    const refresh = await this.createRefreshToken(user);

    await this.updateUserRefreshToken(user.id, refresh);

    return { access_token: access, refresh_token: refresh };
  }

  public async updateUserRefreshToken(
    id: number,
    refreshToken: string,
    queryRunner?: QueryRunner,
  ) {
    // hash the refresh token
    const hashedToken = await hash(refreshToken, 10);

    // update the refresh token.
    await this.usersService.updateUser(
      { id: id, refreshToken: hashedToken },
      queryRunner,
    );
  }

  public async createAccessToken(user: User) {
    let payload;
    if (user.userRole.id == UserRole.EMPLOYEE) {
      payload = {
        organization_id: user.employee!.organizationId,
        role_id: user.userRole.id,
        username: user.username,
        sub: user.id,
      };
    } else {
      payload = {
        role_id: user.userRole.id,
        username: user.username,
        sub: user.id,
      };
    }
    return this.jwtService.sign(payload);
  }

  public async createRefreshToken(user: User) {
    const tokenId = uuid.v4();
    const payload = {
      sub: user.id,
      role: user.userRole.id,
      token: tokenId,
    };
    return this.jwtService.sign(payload, { expiresIn: '7d' });
  }
}
