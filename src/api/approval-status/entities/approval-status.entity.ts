import { BaseEntity } from '../../../common/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('approval_statuses')
export class ApprovalStatus extends BaseEntity {
  @Column({
    name: 'status_name',
    type: 'varchar',
    nullable: false,
  })
  statusName: string;
}
