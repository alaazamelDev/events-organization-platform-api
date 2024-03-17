import { Repository } from 'typeorm';
import { IPermissionRepository } from "../interfaces/permission_repo.interface";
import { Permission } from "../entities/permission.entity";

export const permissionRepository: Pick<IPermissionRepository, any> = { };
