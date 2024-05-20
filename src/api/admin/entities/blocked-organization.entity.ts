import { Organization } from '../../organization/entities/organization.entity';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Entity, JoinColumn, OneToOne, RelationId } from 'typeorm';

@Entity('blocked_organizations')
export class BlockedOrganization extends BaseEntity {
  @OneToOne(() => Organization, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @RelationId(
    (blockedOrganization: BlockedOrganization) =>
      blockedOrganization.organization,
    'organization_id',
  )
  organizationId: number;
}
