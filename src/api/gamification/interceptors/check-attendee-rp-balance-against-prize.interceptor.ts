import {
  BadRequestException,
  CallHandler,
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

    const prize_rp = await this.dataSource
      .getRepository(PrizeEntity)
      .createQueryBuilder('prize')
      .where('prize.id = :prizeID', { prizeID: body.prize_id })
      .getOneOrFail()
      .then((prize) => prize.rp_value);

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

    if (Number(prize_rp) > Number(attendee_rp)) {
      throw new BadRequestException(
        'Attendee RP balance does not cover the prize RP',
      );
    }

    return next.handle();
  }
}
