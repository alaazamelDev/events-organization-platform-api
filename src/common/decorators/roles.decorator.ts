import { SetMetadata } from '@nestjs/common';
import { UserRoleEnum } from '../../api/userRole/enums/user-role.enum';

export const Roles = (...args: UserRoleEnum[]) => SetMetadata('roles', args);
