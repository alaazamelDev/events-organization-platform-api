import { Injectable } from '@nestjs/common';
import { CreateGiftCardVariantDto } from '../dto/create-gift-card-variant.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { GiftCardVariantEntity } from '../entities/gift-card-variant.entity';
import { Repository } from 'typeorm';
import { UpdateGiftCardVariantDto } from '../dto/update-gift-card-variant.dto';

@Injectable()
export class GiftCardVariantService {
  constructor(
    @InjectRepository(GiftCardVariantEntity)
    private readonly giftCardVariantRepository: Repository<GiftCardVariantEntity>,
  ) {}

  async createVariant(dto: CreateGiftCardVariantDto) {
    const variant = this.giftCardVariantRepository.create({
      label: dto.label,
      price: dto.price,
      tickets: dto.tickets,
    });

    await this.giftCardVariantRepository.save(variant, { reload: true });

    return variant;
  }

  async updateVariant(dto: UpdateGiftCardVariantDto) {
    const variant = await this.giftCardVariantRepository.findOneOrFail({
      where: { id: dto.variant_id },
    });

    for (const key in dto) {
      if (dto[key] !== undefined) {
        variant[key] = dto[key];
      }
    }

    await this.giftCardVariantRepository.save(variant, { reload: true });

    return variant;
  }

  async deleteGiftCardVariant(variantID: number) {
    return await this.giftCardVariantRepository.softDelete(variantID);
  }
}
