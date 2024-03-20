import { Address } from '../entities/address.entity';

export class AddressSerializer {
  static serialize(address: Address): { value: number; label: string } {
    const state = address.state.stateName;
    const city = address.city.cityName;
    return {
      value: address.id,
      label: `${state}, ${city}`,
    };
  }

  static serializeList(address: Address[]): { value: number; label: string }[] {
    return address.map((address) => this.serialize(address));
  }
}
