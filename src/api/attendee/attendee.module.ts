import { Module } from '@nestjs/common';
import {
  getDataSourceToken,
  getRepositoryToken,
  TypeOrmModule,
} from '@nestjs/typeorm';
import { Attendee } from './entities/attendee.entity';
import { DataSource } from 'typeorm';
import { attendeeRepository } from './repositories/attendee.repository';
import { AttendeeService } from './services/attendee.service';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/services/user.service';
import { AttendeeController } from './attendee.controller';
import { User } from '../user/entities/user.entity';
import { AuthService } from '../../auth/services/auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([Attendee, User]), UserModule],
  providers: [
    UserService,
    AttendeeService,
    AuthService,
    {
      provide: getRepositoryToken(Attendee),
      inject: [getDataSourceToken()],
      useFactory: function (datasource: DataSource) {
        return datasource.getRepository(Attendee).extend(attendeeRepository);
      },
    },
  ],
  controllers: [AttendeeController],
})
export class AttendeeModule {}
