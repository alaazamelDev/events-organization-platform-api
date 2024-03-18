import { BaseEntity } from "../../../common/entities/base.entity";
import { Column, Entity, OneToMany } from "typeorm";
import { ContactOrganization } from "../../organization/entities/contact_organization.entity";
@Entity()
export class Contact extends BaseEntity {
  @Column()
  name: string;

  @OneToMany(() => ContactOrganization, contactOrganization => contactOrganization.contact)
  public organizations: ContactOrganization[];
}
