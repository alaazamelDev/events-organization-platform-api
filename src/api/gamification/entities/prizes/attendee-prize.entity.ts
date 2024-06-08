import { BaseEntity } from '../../../../common/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Attendee } from '../../../attendee/entities/attendee.entity';
import { PrizeEntity } from './prize.entity';

@Entity({ name: 'attendee_prizes' })
export class AttendeePrizeEntity extends BaseEntity {
  @ManyToOne(() => Attendee)
  @JoinColumn({ name: 'attendee_id' })
  attendee: Attendee;

  @ManyToOne(() => PrizeEntity)
  @JoinColumn({ name: 'prize_id' })
  prize: PrizeEntity;

  @Column({ name: 'prize_id' })
  prize_id: number;

  @Column({ name: 'attendee_id' })
  attendee_id: number;
}
