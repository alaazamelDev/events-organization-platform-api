import { Global, Module } from '@nestjs/common';
import { ConfigurationListsService } from './configuration-lists.service';
import { JobService } from '../job/job.service';
import { ContactService } from '../contact/contact.service';
import { AddressService } from '../address/services/address.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from '../job/entities/job.entity';
import { Contact } from '../contact/entities/contact.entity';
import { Address } from '../address/entities/address.entity';
import { TagService } from '../tag/tag.service';
import { Tag } from '../tag/entities/tag.entity';
import { AgeGroupService } from '../age-group/age-group.service';
import { AgeGroup } from '../age-group/entities/age-group.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Job, Contact, Address, Tag, AgeGroup])],
  exports: [ConfigurationListsService],
  providers: [
    ConfigurationListsService,
    JobService,
    ContactService,
    AddressService,
    TagService,
    AgeGroupService,
  ],
})
export class ConfigurationListsModule {}
