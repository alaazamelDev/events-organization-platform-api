import { BaseEntity } from '../../../common/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('age_groups')
export class AgeGroup extends BaseEntity {
  @Column({
    name: 'from_age',
    type: 'integer',
    unsigned: true,
    nullable: false,
  })
  fromAge: number;

  @Column({
    name: 'to_age',
    type: 'integer',
    unsigned: true,
    nullable: false,
  })
  toAge: number;
}
