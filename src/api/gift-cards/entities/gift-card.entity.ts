import { AfterLoad, Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { GiftCardVariantEntity } from './gift-card-variant.entity';

@Entity({ name: 'gift_cards' })
export class GiftCardEntity extends BaseEntity {
  @Column({ type: 'bytea', nullable: false, unique: true })
  code: Buffer;

  @ManyToOne(() => GiftCardVariantEntity)
  @JoinColumn({ name: 'variant_id' })
  variant: GiftCardVariantEntity;

  @Column({ name: 'variant_id' })
  variant_id: number;

  @Column({ default: false })
  redeemed: boolean = false;

  @Column({ default: true })
  active: boolean = true;

  private CODE: string;

  @AfterLoad()
  decodeCode() {
    if (this.code) {
      this.CODE = this.code.toString('utf-8');
    }
  }

  get card_code(): string {
    return this.CODE;
  }
}
