import { Module } from '@nestjs/common';
import {
  getDataSourceToken,
  getRepositoryToken,
  TypeOrmModule,
} from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './services/user.service';
import { DataSource } from 'typeorm';
import { userRepository } from './repositories/user.repository';
import { UserController } from './user.controller';
import { MenuItem } from './entities/menu-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, MenuItem])],
  exports: [UserService],
  providers: [
    UserService,
    {
      provide: getRepositoryToken(User),
      inject: [getDataSourceToken()],
      useFactory: function (datasource: DataSource) {
        return datasource.getRepository(User).extend(userRepository);
      },
    },
  ],
  controllers: [UserController],
})
export class UserModule {}
