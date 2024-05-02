import { BaseEntity } from '../../../common/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('reactions')
export class Reaction extends BaseEntity {
  @Column({
    name: 'label',
    type: 'varchar',
  })
  label: string;

  @Column({
    name: 'icon',
    type: 'varchar',
  })
  icon: string;
}
