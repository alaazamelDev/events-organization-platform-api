import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  MessageEvent,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as short_uuid from 'short-uuid';
import { GenerateGiftCardsDto } from '../dto/generate-gift-cards.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { GiftCardEntity } from '../entities/gift-card.entity';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { GetGiftCardsSerializer } from '../serializers/get-gift-cards.serializer';
import { GiftCardsPdfService } from './gift-cards-pdf.service';
import { PrintGiftCardsDto } from '../dto/print-gift-cards.dto';

@Injectable()
export class GiftCardService {
  constructor(
    @InjectRepository(GiftCardEntity)
    private readonly giftCardRepository: Repository<GiftCardEntity>,
    private readonly dataSource: DataSource,
    private readonly giftCardsPdfService: GiftCardsPdfService,
  ) {}

  async generateGiftCards(dto: GenerateGiftCardsDto, queryRunner: QueryRunner) {
    const cards = Array.from({ length: dto.amount });

    await Promise.all(
      cards.map(async () => {
        const code = this.generateCode().short.toUpperCase();
        const giftCard = this.giftCardRepository.create({
          code: Buffer.from(code, 'utf8'),
          variant: { id: dto.variant_id },
        });

        await queryRunner.manager.save(giftCard);
      }),
    );

    return 'success';
  }

  async getGiftCards() {
    const data = await this.giftCardRepository.find({
      relations: { variant: true },
    });

    return GetGiftCardsSerializer.serializeList(data);
  }

  generateCode() {
    const translator = short_uuid(short_uuid.constants.uuid25Base36);

    return { short: translator.generate(), original: uuidv4() };
  }

  async printCards(
    clientKey: string,
    ON: (n: number, KEY: string, fileName: string, ack: string) => void,
    _dto: PrintGiftCardsDto,
  ) {
    const onProgress = (progress: number, fileName: string, ack: string) => {
      ON(progress, clientKey, fileName, ack);
    };

    const cards = await this.dataSource
      .getRepository(GiftCardEntity)
      .createQueryBuilder('card')
      // .where('card.id IN (:...cardIds)', { cardIds: dto.gift_cards_ids })
      .leftJoinAndSelect('card.variant', 'variant')
      .getMany();

    if (cards.length === 0) {
      onProgress(0, '', 'No cards matches the given ids');
      return;
    }

    await this.giftCardsPdfService.downloadCardsAsPDF(onProgress, cards);

    return;
  }
}
