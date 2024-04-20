import { Module } from '@nestjs/common';
import { UserRoleService } from './services/user_role.service';
import { UserRoleController } from './user_role.controller';
import {
  getDataSourceToken,
  getRepositoryToken,
  TypeOrmModule,
} from '@nestjs/typeorm';
import { UserRole } from './entities/user_role.entity';
import { DataSource } from 'typeorm';
import { userRoleRepository } from './repositories/user_role.repository';
import { UserRoleMenuItem } from './entities/user-role-menu-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserRole, UserRoleMenuItem])],
  providers: [
    UserRoleService,
    {
      //? INJECT THE CUSTOM REPOSITORY.
      provide: getRepositoryToken(UserRole),
      inject: [getDataSourceToken()],
      useFactory: function (datasource: DataSource) {
        return datasource.getRepository(UserRole).extend(userRoleRepository);
      },
    },
  ],
  controllers: [UserRoleController],
})
export class UserRoleModule {}
