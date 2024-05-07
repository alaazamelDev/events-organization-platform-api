import { ForbiddenException, Injectable } from '@nestjs/common';
import { UserService } from '../../api/user/services/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../api/user/entities/user.entity';
import * as uuid from 'uuid';
import { compare, hash } from 'bcrypt';
import { QueryRunner } from 'typeorm';
import { UserRole } from '../../api/userRole/entities/user_role.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<User | null> {
    const user: User | null =
      await this.usersService.findOneByEmailOrUsername(username);
    if (user) {
      const passwordMatch = await compare(pass, user.password);

      if (passwordMatch) {
        return user;
      }
    }

    return null;
  }

  async login(user: User) {
    const accessToken = await this.createAccessToken(user);
    const refreshToken = await this.createRefreshToken(user);

    // update the refresh token.
    await this.updateUserRefreshToken(user.id, refreshToken);

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
      access_token: accessToken,
      refresh_token: refreshToken,
    };
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
