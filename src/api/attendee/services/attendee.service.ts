import { Injectable, NotFoundException } from '@nestjs/common';
import { Attendee } from '../entities/attendee.entity';
import { UserService } from '../../user/services/user.service';
import { hash } from 'bcrypt';
import { User } from '../../user/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { IAttendeeRepository } from '../interfaces/attendee_repo.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole } from '../../userRole/entities/user_role.entity';
import { AuthService } from '../../../auth/services/auth.service';
import { UpdateAttendeeProfileDto } from '../dto/update-attendee-profile.dto';
import { FileUtilityService } from '../../../config/files/utility/file-utility.service';
import { AttendeeDetailsSerializer } from '../serializers/attendee-details.serializer';
import { RegisterAttendeeDto } from '../dto/register-attendee.dto';
import { Job } from '../../job/entities/job.entity';
import { Address } from '../../address/entities/address.entity';
import { AttendeeContact } from '../entities/attendee-contact.entity';
import { Contact } from '../../contact/entities/contact.entity';
import { AttendeeEvent } from '../../attend-event/entities/attendee-event.entity';
import { BlockedAttendee } from '../../organization/entities/blocked-attendee.entity';
import { FollowingAttendee } from '../../organization/entities/following-attendee.entity';
import * as moment from 'moment';
import {
  DEFAULT_DATE_FORMAT,
  DEFAULT_DB_DATE_FORMAT,
} from '../../../common/constants/constants';

@Injectable()
export class AttendeeService {
  constructor(
    @InjectRepository(Attendee)
    private readonly attendeeRepository: IAttendeeRepository,
    private readonly fileUtilityService: FileUtilityService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly dataSource: DataSource,
    @InjectRepository(AttendeeEvent)
    private readonly attendeeEventRepository: Repository<AttendeeEvent>,
  ) {}

  async isAttendeeBlocked(organizationId: number, userId: number) {
    let attendee;
    try {
      attendee = await this.getAttendeeByUserId(userId);
      return await this.dataSource.manager.exists(BlockedAttendee, {
        where: {
          attendee: { id: attendee.id },
          organization: { id: organizationId },
        },
      });
    } catch (e) {
      return false;
    }
  }

  async isAttendeeFollowingOrg(organizationId: number, attendeeId: number) {
    return this.dataSource.manager.exists(FollowingAttendee, {
      where: {
        organization: { id: organizationId },
        attendee: { id: attendeeId },
      },
    });
  }

  async followOrganization(organizationId: number, attendeeId: number) {
    const followed = await this.dataSource.manager.findOne(FollowingAttendee, {
      relations: { organization: true },
      where: {
        attendee: { id: attendeeId },
        organization: { id: organizationId },
      },
    });

    if (followed) {
      return true;
    }

    const created = this.dataSource.manager.create(FollowingAttendee, {
      organization: { id: organizationId },
      attendee: { id: attendeeId },
    });
    const saved = await this.dataSource.manager.save(
      FollowingAttendee,
      created,
    );
    return !!saved;
  }

  async unfollowOrganization(organizationId: number, attendeeId: number) {
    const followed = await this.dataSource.manager.findOne(FollowingAttendee, {
      relations: { organization: true },
      where: {
        attendee: { id: attendeeId },
        organization: { id: organizationId },
      },
    });

    if (!followed) {
      return true;
    }

    const deleted = await this.dataSource.manager.delete(FollowingAttendee, {
      organization: { id: organizationId },
      attendee: { id: attendeeId },
    });

    return deleted.affected != null && deleted.affected > 0;
  }

  async getListOfFollowedOrganizations(attendeeId: number) {
    return await this.dataSource.manager.find(FollowingAttendee, {
      where: { attendee: { id: attendeeId } },
      relations: { organization: true },
    });
  }

  async getAttendeeByUserId(userId: number): Promise<Attendee> {
    return await this.attendeeRepository.findOneByOrFail({
      user: { id: userId },
    });
  }

  async createAttendee(payload: RegisterAttendeeDto): Promise<any | null> {
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

      console.log(payload.birth_date);
      // create the attendee entity
      const attendeeData = {
        firstName: payload.first_name,
        lastName: payload.last_name,
        birthDate: payload.birth_date
          ? moment(payload.birth_date, DEFAULT_DATE_FORMAT).format(
              DEFAULT_DB_DATE_FORMAT,
            )
          : undefined,
        phoneNumber: payload.phone_number,
        bio: payload.bio,
        job: payload.job_id ? ({ id: payload.job_id } as Job) : undefined,
        address: payload.address_id
          ? ({ id: payload.address_id } as Address)
          : undefined,
        profilePictureUrl: payload.profile_img ?? undefined,
        coverPictureUrl: payload.cover_img ?? undefined,
      };

      const attendee = this.attendeeRepository.create(attendeeData);

      // add the FK.
      attendee.user = { id: user.id } as User;

      // save entity
      await queryRunner.manager.save(attendee);

      // save contacts
      if (payload.contacts?.length > 0) {
        for (const attendeeContact of payload.contacts
          .map<AttendeeContact>(
            (contact) =>
              ({
                contact: { id: contact.contact_id } as Contact,
                attendee: { id: attendee.id } as Attendee,
                content: contact.contact_link,
              }) as AttendeeContact,
          )
          .map((contact) => {
            return queryRunner.manager.create(AttendeeContact, contact);
          })) {
          // save the created entities
          await queryRunner.manager.save(AttendeeContact, attendeeContact);
        }
      }

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
        attendee_id: attendee.id,
        user_role: user.userRole,
        access_token: accessToken,
        refresh_token: refreshToken,
        email: user.email,
      };
    } catch (e) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw e;
    }
  }

  async updateAttendeeProfile(payload: UpdateAttendeeProfileDto) {
    const attendee = await this.attendeeRepository.findOneBy({
      id: payload.id!,
    });

    if (!attendee) {
      throw new NotFoundException(
        `Attendee with ID=${payload.id} was not found!`,
      );
    }
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      // Update the main entity.
      await queryRunner.manager.update(
        Attendee,
        payload.id!,
        UpdateAttendeeProfileDto.toModel(payload),
      );

      // update contacts.
      if (payload.contacts && payload.contacts.length > 0) {
        // delete all attendee contacts.
        await queryRunner.manager.delete(AttendeeContact, {
          attendee: { id: payload.id },
        });

        const contacts = (payload.contacts ?? [])
          .map((contact) => {
            return {
              attendee: { id: payload.id },
              contact: { id: contact.contact_id },
              content: contact.contact_link,
            } as AttendeeContact;
          })
          .map((contact) => {
            return queryRunner.manager.create(AttendeeContact, contact);
          });

        // insert the new attendee_contact records.
        await queryRunner.manager.save<AttendeeContact>(contacts);
      }

      await queryRunner.commitTransaction();
      await queryRunner.release();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw e;
    }

    const updatedAttendee = await this.attendeeRepository.findOne({
      relations: { address: true, contacts: true, job: true },
      where: { id: payload.id },
    });
    return AttendeeDetailsSerializer.serialize(
      updatedAttendee!,
      this.fileUtilityService,
    );
  }

  async getAttendeeDetails(attendeeId: number) {
    const attendee = await this.attendeeRepository.findOne({
      relations: { address: true, contacts: true, job: true, user: true },
      where: { id: attendeeId },
    });

    if (!attendee) {
      throw new NotFoundException(
        `Attendee with ID=${attendeeId} was not found!`,
      );
    }
    return AttendeeDetailsSerializer.serialize(
      attendee,
      this.fileUtilityService,
    );
  }

  async getAttendeeEvents(id: number) {
    const attendee = await this.attendeeRepository.findOneOrFail({
      where: {
        user: { id: id } as User,
      },
    });

    return await this.attendeeEventRepository.find({
      where: {
        attendee: { id: +attendee.id } as Attendee,
      },
      relations: {
        event: true,
      },
    });
  }

  async getAttendeeIdByEmail(email: string) {
    return await this.dataSource
      .getRepository(Attendee)
      .createQueryBuilder('attendee')
      .innerJoinAndSelect('attendee.user', 'user')
      .where('user.email = :userEmail', { userEmail: email })
      .select(['attendee.id'])
      .getOneOrFail();
  }
}
