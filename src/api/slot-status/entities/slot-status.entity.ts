import { BaseEntity } from '../../../common/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('slot_statuses')
export class SlotStatus extends BaseEntity {
  static PENDING = 1;
  static COMPLETED = 2;
  static CANCELLED = 3;
  static IN_PROGRESS = 4;

  @Column({
    name: 'status_name',
    type: 'varchar',
  })
  statusName!: string;
}
