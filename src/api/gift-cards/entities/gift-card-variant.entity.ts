import { BaseEntity } from '../../../common/entities/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { GiftCardEntity } from './gift-card.entity';

@Entity({ name: 'gift_card_variants' })
export class GiftCardVariantEntity extends BaseEntity {
  @Column()
  label: string;

  @Column({ type: 'float' })
  price: number;

  @Column()
  tickets: number;

  @OneToMany(() => GiftCardEntity, (giftCardEntity) => giftCardEntity.variant)
  giftCards: GiftCardEntity[];

  [key: string]: any;
}
