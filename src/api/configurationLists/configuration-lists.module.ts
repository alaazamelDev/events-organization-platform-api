import { Module } from '@nestjs/common';
import { ConfigurationListsService } from './configuration-lists.service';
import { JobService } from '../job/job.service';
import { ContactService } from '../contact/contact.service';
import { AddressService } from '../address/services/address.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from '../job/entities/job.entity';
import { Contact } from '../contact/entities/contact.entity';
import { Address } from '../address/entities/address.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Job, Contact, Address])],
  providers: [
    ConfigurationListsService,
    JobService,
    ContactService,
    AddressService,
  ],
})
export class ConfigurationListsModule {}
