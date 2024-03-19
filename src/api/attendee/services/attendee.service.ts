import { Injectable } from '@nestjs/common';
import { Attendee } from '../entities/attendee.entity';
import { UserService } from '../../user/services/user.service';
import { hash } from 'bcrypt';
import { User } from '../../user/entities/user.entity';
import { DataSource } from 'typeorm';
import { IAttendeeRepository } from '../interfaces/attendee_repo.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole } from '../../userRole/entities/user_role.entity';
import { AuthService } from '../../../auth/services/auth.service';

@Injectable()
export class AttendeeService {
  constructor(
    @InjectRepository(Attendee)
    private readonly attendeeRepository: IAttendeeRepository,
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly dataSource: DataSource,
  ) {}

  async createAttendee(payload: any): Promise<any | null> {
    // we should run a transaction and create user & attendee
    // entities respectively.

    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      // hash the password
      const hashedPassword = await hash(payload.password, 10);

      const userData = {
        email: payload.email,
        username: payload.username,
        password: hashedPassword,
        role_id: UserRole.ATTENDEE,
      };

      // create a new user.
      const user: User = await this.userService.createUser(
        userData,
        queryRunner,
      );

      // create the attendee entity
      const attendeeData = {
        firstName: payload.first_name,
        lastName: payload.last_name,
        birthDate: payload.birth_date,
        profilePictureUrl: payload.profile_img ?? undefined,
      };

      const attendee = this.attendeeRepository.create(attendeeData);

      // add the FK.
      attendee.user = { id: user.id } as User;

      // save entity
      await queryRunner.manager.save(attendee);

      // generate access token for the attendee.
      const accessToken = await this.authService.createAccessToken(user);
      const refreshToken = await this.authService.createRefreshToken(user);

      // update the refresh token.
      await this.authService.updateUserRefreshToken(
        user.id,
        refreshToken,
        queryRunner,
      );

      await queryRunner.commitTransaction();
      await queryRunner.release();

      return {
        user_id: user.id,
        username: user.username,
        user_role: user.userRole,
        access_token: accessToken,
        refresh_token: refreshToken,
      };
    } catch (e) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw e;
    }
  }
}
