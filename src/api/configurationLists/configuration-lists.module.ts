import { Global, Module } from '@nestjs/common';
import { ConfigurationListsService } from './configuration-lists.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from '../job/entities/job.entity';
import { Contact } from '../contact/entities/contact.entity';
import { Address } from '../address/entities/address.entity';
import { Tag } from '../tag/entities/tag.entity';
import { AgeGroup } from '../age-group/entities/age-group.entity';
import { JobModule } from '../job/job.module';
import { ContactModule } from '../contact/contact.module';
import { AddressModule } from '../address/address.module';
import { TagModule } from '../tag/tag.module';
import { AgeGroupModule } from '../age-group/age-group.module';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([Job, Contact, Address, Tag, AgeGroup]),
    JobModule,
    ContactModule,
    AddressModule,
    TagModule,
    AgeGroupModule,
  ],
  exports: [ConfigurationListsService],
  providers: [ConfigurationListsService],
})
export class ConfigurationListsModule {}
