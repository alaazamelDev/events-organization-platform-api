import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('cities')
export class City extends BaseEntity {
  @Column({
    name: 'city_name',
    type: 'varchar',
    nullable: false,
  })
  cityName: string;
}
