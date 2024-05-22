import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BlockedUser } from './entities/blocked-user.entity';
import { Attendee } from '../attendee/entities/attendee.entity';
import { UserRole } from '../userRole/entities/user_role.entity';
import { Employee } from '../employee/entities/employee.entity';
import { BlockedOrganization } from './entities/blocked-organization.entity';
import { Organization } from '../organization/entities/organization.entity';
import { GenericFilter } from '../../common/interfaces/query.interface';

@Injectable()
export class AdminService {
  constructor(private readonly dataSource: DataSource) {}

  public async getListOfBlockedAttendees(query: GenericFilter) {
    // get the repository
    const repo = this.dataSource.getRepository(BlockedUser);

    return repo.findAndCount({
      where: { userRole: { id: UserRole.ATTENDEE } },
      relations: { user: { attendee: true } },
      loadEagerRelations: true,
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
    });
  }

  public async getListOfBlockedOrganizations(query: GenericFilter) {
    // get the repository
    const repo = this.dataSource.getRepository(BlockedOrganization);

    return repo.findAndCount({
      relations: { organization: true },
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
      loadEagerRelations: true,
    });
  }

  public async blockAttendee(attendeeId: number) {
    const userId = await this.dataSource
      .getRepository(Attendee)
      .findOneOrFail({
        where: { id: attendeeId },
        loadRelationIds: true,
      })
      .then((attendee) => attendee.userId);

    return this.blockUser(UserRole.ATTENDEE, userId!);
  }

  public async blockOrganization(organizationId: number) {
    // check if already blocked
    const repo = this.dataSource.getRepository(BlockedOrganization);
    const isBlocked = await repo.exists({
      where: { organization: { id: organizationId } },
    });

    if (isBlocked) {
      throw new BadRequestException('Organization is already blocked!');
    }

    // check if the organization is existing.
    const isExist = await this.dataSource
      .getRepository(Organization)
      .existsBy({ id: organizationId });

    if (!isExist) {
      throw new NotFoundException('the given organization id is not exist');
    }

    const created = repo.create({ organization: { id: organizationId } });
    return !!(await repo.save(created));
  }

  private async blockUser(
    userRoleId: number,
    userId: number,
  ): Promise<boolean> {
    const repo = this.dataSource.getRepository(BlockedUser);

    // check if already blocked
    const isBlocked = await repo.exists({
      where: {
        user: { id: userId },
        userRole: { id: userRoleId },
      },
    });

    if (isBlocked) {
      throw new BadRequestException(`User is already blocked`);
    }

    const created = repo.create({
      user: { id: userId },
      userRole: { id: userRoleId },
    });

    return !!(await repo.save(created));
  }

  public async blockEmployee(employeeId: number) {
    const userId = await this.dataSource
      .getRepository(Employee)
      .findOneOrFail({
        where: { id: employeeId },
        loadRelationIds: true,
      })
      .then((employee) => employee.userId);

    return this.blockUser(UserRole.EMPLOYEE, userId!);
  }
}
