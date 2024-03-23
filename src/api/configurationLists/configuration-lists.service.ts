import { Injectable } from '@nestjs/common';
import { JobService } from '../job/job.service';
import { JobSerializer } from '../job/serializers/job.serializer';
import { ContactService } from '../contact/contact.service';
import { ContactSerializer } from '../contact/serializers/contact.serializer';
import { AddressService } from '../address/services/address.service';
import { AddressSerializer } from '../address/serializers/address.serializer';
import { TagService } from '../tag/tag.service';
import { TagSerializer } from '../tag/serializers/tag.serializer';

@Injectable()
export class ConfigurationListsService {
  constructor(
    private readonly jobService: JobService,
    private readonly contactService: ContactService,
    private readonly addressService: AddressService,
    private readonly tagService: TagService,
  ) {}

  async getAttendeeLists() {
    const jobs = await this.jobService.findAll();
    const contacts = await this.contactService.findAll();
    const addresses = await this.addressService.findAll();

    // Serialize Data
    return {
      jobs: JobSerializer.serializeList(jobs),
      contacts: ContactSerializer.serializeList(contacts),
      addresses: AddressSerializer.serializeList(addresses),
    };
  }

  async getEventLists() {
    const addresses = await this.addressService.findAll();
    const tags = await this.tagService.findAll();

    // Serialize Data
    return {
      tags: TagSerializer.serializeList(tags),
      addresses: AddressSerializer.serializeList(addresses),
    };
  }
}
