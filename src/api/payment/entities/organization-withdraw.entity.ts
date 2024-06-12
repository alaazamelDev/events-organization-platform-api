import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Organization } from '../../organization/entities/organization.entity';
import { OrganizationWithdrawStatusEnum } from '../enums/organization-withdraw-status.enum';

@Entity({ name: 'organization_withdraw' })
export class OrganizationWithdraw extends BaseEntity {
  @Column({})
  amount: number;

  @ManyToOne(() => Organization)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @Column({ name: 'organization_id' })
  organization_id: number;

  @Column({
    type: 'enum',
    enum: OrganizationWithdrawStatusEnum,
  })
  status: OrganizationWithdrawStatusEnum;
}
