import { Injectable } from '@nestjs/common';
import { RedeemGiftCardDto } from '../dto/redeem-gift-card.dto';
import { QueryRunner, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GiftCardEntity } from '../entities/gift-card.entity';
import { AttendeeService } from '../../attendee/services/attendee.service';
import { AttendeesTickets } from '../../payment/entities/attendees-tickets.entity';
import { TicketsEventTypes } from '../../payment/constants/tickets-event-types.constant';

@Injectable()
export class GiftCardRedeemService {
  constructor(
    @InjectRepository(GiftCardEntity)
    private readonly giftCardRepository: Repository<GiftCardEntity>,
    @InjectRepository(AttendeesTickets)
    private readonly attendeesTicketsRepository: Repository<AttendeesTickets>,
    private readonly attendeeService: AttendeeService,
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
}
