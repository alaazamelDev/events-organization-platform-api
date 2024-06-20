import { isNil, omitBy } from 'lodash';
import { GiftCardEntity } from '../entities/gift-card.entity';

export class GetGiftCardsSerializer {
  static serialize(history: GiftCardEntity) {
    return omitBy(history, isNil);
  }

  static serializeList(data: GiftCardEntity[]) {
    return data.map((item) => {
      return {
        id: item.id,
        redeemed: item.redeemed,
        variant_id: item.variant_id,
        variant: item.variant,
        CODE: item.card_code,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        deletedAt: item.deletedAt,
      };
    });
  }
}
