import { BaseEntity } from '../../../common/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('slot_statuses')
export class SlotStatus extends BaseEntity {
  @Column({
    name: 'status_name',
    type: 'varchar',
  })
  statusName!: string;
}
