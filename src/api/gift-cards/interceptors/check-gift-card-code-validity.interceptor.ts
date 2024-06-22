import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { RedeemGiftCardDto } from '../dto/redeem-gift-card.dto';
import { DataSource } from 'typeorm';
import { GiftCardEntity } from '../entities/gift-card.entity';
import { GetGiftCardInfoDto } from '../dto/get-gift-card-info.dto';

@Injectable()
export class CheckGiftCardCodeValidityInterceptor implements NestInterceptor {
  constructor(private readonly dataSource: DataSource) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const body = request.body as RedeemGiftCardDto | GetGiftCardInfoDto;

    const code = Buffer.from(body.code, 'utf8').toString('hex');

    const giftCard = await this.dataSource
      .getRepository(GiftCardEntity)
      .createQueryBuilder('gift-card')
      .where("gift-card.code = decode(:code, 'hex')", { code: code })
      .getOne();

    console.log(giftCard);

    if (!giftCard) {
      throw new BadRequestException('Invalid Code');
    }
    if (giftCard && giftCard.redeemed) {
      throw new BadRequestException('Code Already Used');
    }
    if (giftCard && !giftCard.active) {
      throw new BadRequestException('Code Is Not Active');
    }

    return next.handle();
  }
}
