import { BaseEntity } from '../../../common/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { City } from '../../city/entities/city.entity';
import { State } from '../../state/entities/state.entity';

@Entity('addresses')
export class Address extends BaseEntity {
  @ManyToOne(() => City, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @Column({
    name: 'city_id',
    type: 'bigint',
    unsigned: true,
    nullable: false,
  })
  @JoinColumn({ name: 'city_id' })
  city: City;

  @ManyToOne(() => State, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @Column({
    name: 'state_id',
    type: 'bigint',
    unsigned: true,
    nullable: false,
  })
  @JoinColumn({ name: 'state_id' })
  state: State;
}
