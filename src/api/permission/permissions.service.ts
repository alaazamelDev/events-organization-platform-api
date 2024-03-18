import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { IPermissionRepository } from "./interfaces/permission_repo.interface";
import { Permission } from "./entities/permission.entity";

@Injectable()
export class PermissionsService {
  constructor(
      @InjectRepository(Permission)
      private readonly permissionRepository: IPermissionRepository
    ) {}

  async getPermissions() {
    return await this.permissionRepository.find();
  }
}
