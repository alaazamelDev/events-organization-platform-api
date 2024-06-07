import { BaseEntity } from '../../../../common/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'g_prize_types' })
export class PrizeTypeEntity extends BaseEntity {
  @Column()
  name: string;
}
