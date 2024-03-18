import { Repository } from "typeorm";
import { Permission } from "../entities/permission.entity";

export interface IPermissionRepository extends Repository<Permission> {
  this: Repository<Permission>;
}