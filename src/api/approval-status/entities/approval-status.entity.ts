import { BaseEntity } from '../../../common/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('approval_statuses')
export class ApprovalStatus extends BaseEntity {
  static IN_REVIEW = 1;
  static APPROVED = 2;
  static DECLINED = 3;
  @Column({
    name: 'status_name',
    type: 'varchar',
    nullable: false,
  })
  statusName: string;
}
