import { BaseEntity } from '../../../../common/entities/base.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { PrizeEntity } from './prize.entity';

@Entity({ name: 'g_tickets_prizes' })
export class TicketPrizeEntity extends BaseEntity {
  @Column()
  tickets_value: number;

  @OneToOne(() => PrizeEntity)
  @JoinColumn({ name: 'prize_id' })
  prize: PrizeEntity;

  @Column({ name: 'prize_id' })
  prize_id: number;

  [key: string]: any;
}
