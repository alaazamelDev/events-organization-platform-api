import {
  Unique,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Organization } from './organization.entity';
import { Address } from '../../address/entities/address.entity';

@Entity()
@Unique(['organization', 'address'])
export class AddressOrganization {
  @PrimaryGeneratedColumn({
    name: 'id',
    type: 'bigint',
    unsigned: true,
  })
  id: number;

  @ManyToOne(() => Organization, (organization) => organization.addresses)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @ManyToOne(() => Address, (address) => address.organizations)
  @JoinColumn({ name: 'address_id' })
  address: Address;
}
