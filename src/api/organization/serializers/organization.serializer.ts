import { Organization } from '../entities/organization.entity';

export class OrganizationSerializer {
  static serialize(data?: Organization) {
    if (!data) return null;
    return {
      id: data.id,
      name: data.name,
      bio: data.bio,
      description: data.description,
      cover_picture: data.cover_picture,
      main_picture: data.main_picture,
      // TODO:ADD IMAGES
    };
  }
}
