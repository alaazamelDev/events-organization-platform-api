import { Injectable } from '@nestjs/common';
import { RedeemGiftCardDto } from '../dto/redeem-gift-card.dto';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GiftCardEntity } from '../entities/gift-card.entity';
import { AttendeeService } from '../../attendee/services/attendee.service';
import { AttendeesTickets } from '../../payment/entities/attendees-tickets.entity';
import { TicketsEventTypes } from '../../payment/constants/tickets-event-types.constant';
import { GetGiftCardInfoDto } from '../dto/get-gift-card-info.dto';
import { GetGiftCardsSerializer } from '../serializers/get-gift-cards.serializer';

@Injectable()
export class GiftCardRedeemService {
  constructor(
    @InjectRepository(GiftCardEntity)
    private readonly giftCardRepository: Repository<GiftCardEntity>,
    @InjectRepository(AttendeesTickets)
    private readonly attendeesTicketsRepository: Repository<AttendeesTickets>,
    private readonly attendeeService: AttendeeService,
    private readonly dataSource: DataSource,
  ) {}

  async redeemGiftCard(
    dto: RedeemGiftCardDto,
    userID: number,
    queryRunner: QueryRunner,
  ) {
    const giftCard = await this.giftCardRepository.findOneOrFail({
      where: { code: Buffer.from(dto.code, 'utf8') },
      relations: { variant: true },
    });

    const attendee = await this.attendeeService.getAttendeeByUserId(userID);

    giftCard.redeemed = true;

    await queryRunner.manager.save(giftCard, { reload: true });

    const attendeeTickets = this.attendeesTicketsRepository.create({
      attendee: { id: attendee.id },
      event_type_id: TicketsEventTypes.REDEEM_GIFT_CARD,
      value: giftCard.variant.tickets,
      data: { gift_card_id: giftCard.id },
    });

    await queryRunner.manager.save(attendeeTickets);

    return 'success';
  }

  async getGiftCardInfo(dto: GetGiftCardInfoDto) {
    const code = Buffer.from(dto.code, 'utf8').toString('hex');

    const card = await this.dataSource
      .getRepository(GiftCardEntity)
      .createQueryBuilder('gift-card')
      .where("gift-card.code = decode(:code, 'hex')", { code: code })
      .leftJoinAndSelect('gift-card.variant', 'variant')
      .getOneOrFail();

    return GetGiftCardsSerializer.serialize(card);
  }
}
