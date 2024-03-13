import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('states')
export class State extends BaseEntity {
  @Column({
    name: 'state_name',
    type: 'varchar',
    nullable: false,
  })
  stateName: string;
}
