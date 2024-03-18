import { Repository } from 'typeorm';
import { Address } from '../entities/address.entity';

export interface IAddressRepository extends Repository<Address> {}
