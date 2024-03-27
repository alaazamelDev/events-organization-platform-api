import { Organization } from '../entities/organization.entity';

export class OrganizationSerializer {
  static serialize(data?: Organization) {
    if (!data) return null;
    return {
      name: data.name,
      bio: data.bio,
      description: data.description,
      // TODO:ADD IMAGES
    };
  }
}
