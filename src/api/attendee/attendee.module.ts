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
import { MulterConfigModule } from '../../config/files/multer/config.module';
import { MulterConfigService } from '../../config/files/multer/config.service';
import { AttendeeContact } from './entities/attendee-contact.entity';
import { FileUtilityService } from '../../config/files/utility/file-utility.service';
import { AppConfigService } from '../../config/app/config.service';
import { ConfigurationListsService } from '../configurationLists/configuration-lists.service';
import { ConfigurationListsModule } from '../configurationLists/configuration-lists.module';
import { Job } from '../job/entities/job.entity';
import { Contact } from '../contact/entities/contact.entity';
import { Address } from '../address/entities/address.entity';
import { JobService } from '../job/job.service';
import { ContactService } from '../contact/contact.service';
import { AddressService } from '../address/services/address.service';
import { TagService } from '../tag/tag.service';
import { Tag } from '../tag/entities/tag.entity';
import { AgeGroup } from '../age-group/entities/age-group.entity';
import { AgeGroupService } from '../age-group/age-group.service';
import { AttendeeEvent } from '../attend-event/entities/attendee-event.entity';
import { FollowingAttendee } from '../organization/entities/following-attendee.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Attendee,
      User,
      AttendeeContact,
      Job,
      Contact,
      Address,
      Tag,
      AgeGroup,
      AttendeeEvent,
      FollowingAttendee,
    ]),
    UserModule,
    MulterConfigModule,
    ConfigurationListsModule,
  ],
  providers: [
    UserService,
    AttendeeService,
    AuthService,
    MulterConfigService,
    FileUtilityService,
    AppConfigService,
    JobService,
    ContactService,
    AddressService,
    TagService,
    AgeGroupService,
    ConfigurationListsService,
    {
      provide: getRepositoryToken(Attendee),
      inject: [getDataSourceToken()],
      useFactory: function (datasource: DataSource) {
        return datasource.getRepository(Attendee).extend(attendeeRepository);
      },
    },
  ],
  controllers: [AttendeeController],
  exports: [AttendeeService],
})
export class AttendeeModule {}
