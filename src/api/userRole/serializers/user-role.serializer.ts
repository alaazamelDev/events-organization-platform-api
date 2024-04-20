import { UserRole } from '../entities/user_role.entity';

export class UserRoleSerializer {
  static serialize(data?: UserRole) {
    if (!data) return undefined;

    return {
      id: data.id,
      role_name: data.roleName,
    };
  }

  static serializeList(data?: UserRole[]) {
    if (!data) return undefined;
    return data.map((item) => this.serialize(item));
  }
}
