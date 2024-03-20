import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from '../entities/address.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {}

  findAll() {
    return this.addressRepository.find({
      relations: { city: true, state: true },
      select: {
        id: true,
        state: { id: true, stateName: true },
        city: { id: true, cityName: true },
      },
    });
  }
}
