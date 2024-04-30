import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserService } from '../../../api/user/services/user.service';
import { UserRole } from '../../../api/userRole/entities/user_role.entity';
import { DataSource } from 'typeorm';
import { Employee } from '../../../api/employee/entities/employee.entity';
import { Attendee } from '../../../api/attendee/entities/attendee.entity';
import { Admin } from '../../../api/admin/entities/admin.entity';

/**
 * This interceptor is responsible for appending the entity id (admin, employee, attendee)
 * to the request payload based on the provided user id (named "sub")
 * */
@Injectable()
export class EntityIdMapperInterceptor implements NestInterceptor {
  constructor(
    private readonly userService: UserService,
    private readonly datasource: DataSource,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const userID = request.user.sub;

    // Check User Role
    const userRoleId: number = await this.userService.getUserRoleId(userID);
    console.log('Role: ' + userRoleId);

    let entityId: null | number = null;

    switch (+userRoleId) {
      case UserRole.EMPLOYEE:
        entityId = await this.datasource
          .getRepository(Employee)
          .findOneByOrFail({ user: { id: userID } })
          .then((employee) => employee.id);
        break;
      case UserRole.ATTENDEE:
        entityId = await this.datasource
          .getRepository(Attendee)
          .findOneByOrFail({ user: { id: userID } })
          .then((attendee) => attendee.id);
        break;
      case UserRole.ADMIN:
        entityId = await this.datasource
          .getRepository(Admin)
          .findOneByOrFail({ user: { id: userID } })
          .then((admin) => admin.id);
        break;
    }

    request.user.entity_id = entityId;

    return next.handle();
  }
}
