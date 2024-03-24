import { Organization } from '../entities/organization.entity';
import { Exclude, Expose } from 'class-transformer';
import { ContactOrganization } from '../entities/contact_organization.entity';

export class AllOrganizationsAdminSerializer extends Organization {
  @Exclude()
  deletedAt: Date;

  @Exclude()
  description: string;

  @Exclude()
  cover_picture: string;

  @Exclude()
  updatedAt: Date;

  @Exclude()
  createdAt: Date;

  @Expose()
  get registration_date() {
    return this.createdAt;
  }

  constructor(partial: Partial<Organization>) {
    super();
    Object.assign(this, partial);
  }
}
