import { BaseEntity } from '../../../../common/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { PrizeTypeEntity } from './prize-type.entity';
import { TicketPrizeEntity } from './ticket-prize.entity';

@Entity({ name: 'g_prizes' })
export class PrizeEntity extends BaseEntity {
  @Column()
  name: string;

  @Column()
  rp_value: number;

  @Column({ default: true })
  enabled: boolean;

  @Column()
  rank: number;

  @ManyToOne(() => PrizeTypeEntity)
  @JoinColumn({ name: 'type_id' })
  type: PrizeTypeEntity;

  @Column({ name: 'type_id' })
  type_id: number;

  @OneToOne(() => TicketPrizeEntity, (ticketsPrize) => ticketsPrize.prize, {
    eager: true,
  })
  tickets_prize?: TicketPrizeEntity;

  [key: string]: any;
}
