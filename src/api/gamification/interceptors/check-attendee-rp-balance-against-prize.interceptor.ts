import {
  CallHandler,
  ConflictException,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { DataSource } from 'typeorm';
import { Attendee } from '../../attendee/entities/attendee.entity';
import { RedeemPrizeDto } from '../dto/prizes/redeem-prize.dto';
import { PrizeEntity } from '../entities/prizes/prize.entity';
import { AttendeeRedeemablePointsEntity } from '../entities/rewards-attendee/attendee-redeemable-points.entity';

@Injectable()
export class CheckAttendeeRpBalanceAgainstPrizeInterceptor
  implements NestInterceptor
{
  constructor(private readonly dataSource: DataSource) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const body = request.body as RedeemPrizeDto;
    const userID = request.user.sub;

    const prizes = await Promise.all(
      body.prizes.map(async (prize) => {
        return await this.dataSource
          .getRepository(PrizeEntity)
          .createQueryBuilder('prize')
          .where('prize.id = :prizeID', { prizeID: prize.prize_id })
          .getOneOrFail();
      }),
    );

    const total_prizes_rp = prizes.reduce(
      (acc, prize) => acc + Number(prize.rp_value),
      0,
    );

    const attendee = await this.dataSource
      .getRepository(Attendee)
      .createQueryBuilder('attendee')
      .where('attendee.user = :userID', { userID: userID })
      .getOneOrFail();

    const attendee_rp = await this.dataSource
      .getRepository(AttendeeRedeemablePointsEntity)
      .createQueryBuilder('attendeeRP')
      .where('attendeeRP.attendee = :attendeeID', { attendeeID: attendee.id })
      .groupBy('attendeeRP.attendee')
      .select('SUM(attendeeRP.value)', 'rp')
      .getRawOne()
      .then((result) => (result ? result.rp : 0));

    if (Number(total_prizes_rp) > Number(attendee_rp)) {
      throw new ConflictException(
        'Attendee RP balance does not cover the prize RP',
      );
    }

    return next.handle();
  }
}
