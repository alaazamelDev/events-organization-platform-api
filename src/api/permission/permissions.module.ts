import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { getDataSourceToken, getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
import { Permission } from "./entities/permission.entity";
import { UserRole } from "../userRole/entities/user_role.entity";
import { DataSource } from "typeorm";
import { permissionRepository } from "./repositories/permission.repository";
import { PermissionController } from "./permission.controller";
@Module({
  imports: [TypeOrmModule.forFeature([Permission])],
  controllers: [PermissionController],
  providers: [
    PermissionsService,
    {
      provide: getRepositoryToken(Permission),
      inject: [getDataSourceToken()],
      useFactory: function (datasource: DataSource) {
        return datasource.getRepository(Permission).extend(permissionRepository);
      },
    },
  ],
})
export class PermissionsModule {}
