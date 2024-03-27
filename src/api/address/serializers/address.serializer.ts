import { Address } from '../entities/address.entity';

export class AddressSerializer {
  static serialize(address?: Address): { value: number; label: string } | null {
    if (!address) {
      return null;
    }

    const state = address.state.stateName;
    const city = address.city.cityName;
    return {
      value: address.id,
      label: `${state}, ${city}`,
    };
  }

  static serializeList(
    addresses: Address[],
  ): ({ value: number; label: string } | null)[] {
    return addresses.map((address) => this.serialize(address));
  }
}
