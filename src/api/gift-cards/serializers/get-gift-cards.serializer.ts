import { GiftCardEntity } from '../entities/gift-card.entity';

export class GetGiftCardsSerializer {
  static serialize(item: GiftCardEntity) {
    return {
      id: item.id,
      redeemed: item.redeemed,
      variant_id: item.variant_id,
      variant: item.variant,
      CODE: item.card_code,
      active: item.active,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      deletedAt: item.deletedAt,
    };
  }

  static serializeList(data: GiftCardEntity[]) {
    return data.map((item) => {
      return {
        id: item.id,
        redeemed: item.redeemed,
        variant_id: item.variant_id,
        variant: item.variant,
        CODE: item.card_code,
        active: item.active,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        deletedAt: item.deletedAt,
      };
    });
  }
}
