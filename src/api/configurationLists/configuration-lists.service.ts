import { Injectable } from '@nestjs/common';
import { JobService } from '../job/job.service';
import { JobSerializer } from '../job/serializers/job.serializer';
import { ContactService } from '../contact/contact.service';
import { ContactSerializer } from '../contact/serializers/contact.serializer';
import { AddressService } from '../address/services/address.service';
import { AddressSerializer } from '../address/serializers/address.serializer';

@Injectable()
export class ConfigurationListsService {
  constructor(
    private readonly jobService: JobService,
    private readonly contactService: ContactService,
    private readonly addressService: AddressService,
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
}
