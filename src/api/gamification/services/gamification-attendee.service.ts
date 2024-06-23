import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AttendeeBadgeEntity } from '../entities/rewards-attendee/attendee-badge.entity';
import { AttendeePointsEntity } from '../entities/rewards-attendee/attendee-points.entity';
import { AttendeeRedeemablePointsEntity } from '../entities/rewards-attendee/attendee-redeemable-points.entity';
import { AttendeePrizeEntity } from '../entities/prizes/attendee-prize.entity';
import { PrizeTypesEnum } from '../constants/prize-types.constant';
import { TicketPrizeEntity } from '../entities/prizes/ticket-prize.entity';
import { PrizeEntity } from '../entities/prizes/prize.entity';
import { GetAttendeeRpsHistorySerializer } from '../serializers/get-attendee-rps-history.serializer';

@Injectable()
export class GamificationAttendeeService {
  constructor(private readonly dataSource: DataSource) {}

  async getAttendeeBadges(attendeeID: number) {
    return await this.dataSource
      .getRepository(AttendeeBadgeEntity)
      .createQueryBuilder('attendeeBadge')
      .leftJoinAndSelect('attendeeBadge.badge', 'badge')
      .leftJoinAndSelect('badge.reward', 'reward')
      .select('badge', 'badge')
      .addSelect('reward', 'reward')
      .addSelect('COUNT(attendeeBadge.id)', 'earned')
      .where('attendeeBadge.attendee_id = :attendeeID', { attendeeID })
      .groupBy('badge.id')
      .addGroupBy('reward.id')
      .getRawMany();
  }

  async getAttendeeBadgesHistory(attendeeID: number) {
    return await this.dataSource
      .getRepository(AttendeeBadgeEntity)
      .createQueryBuilder('attendeeBadge')
      .leftJoinAndSelect('attendeeBadge.badge', 'badge')
      .leftJoinAndSelect('badge.reward', 'reward')
      .where('attendeeBadge.attendee_id = :attendeeID', { attendeeID })
      .getMany();
  }

  async getAttendeePoints(attendeeID: number) {
    const result = await this.dataSource
      .getRepository(AttendeePointsEntity)
      .createQueryBuilder('attendeePoints')
      .where('attendeePoints.attendee_id = :attendeeID', {
        attendeeID: attendeeID,
      })
      .groupBy('attendeePoints.attendee_id')
      .select('SUM(attendeePoints.value)', 'points')
      .getRawOne();

    return result ? result : { points: '0' };
  }

  async getAttendeePointsHistory(attendeeID: number) {
    return await this.dataSource
      .getRepository(AttendeePointsEntity)
      .createQueryBuilder('attendeePoints')
      .where('attendeePoints.attendee_id = :attendeeID', {
        attendeeID: attendeeID,
      })
      .getMany();
  }

  async getAttendeeRedeemablePoints(attendeeID: number) {
    const result = await this.dataSource
      .getRepository(AttendeeRedeemablePointsEntity)
      .createQueryBuilder('attendeePoints')
      .where('attendeePoints.attendee_id = :attendeeID', {
        attendeeID: attendeeID,
      })
      .groupBy('attendeePoints.attendee_id')
      .select('SUM(attendeePoints.value)', 'points')
      .getRawOne();

    return result ? result : { points: '0' };
  }

  async getAttendeeRedeemablePointsHistory(attendeeID: number) {
    const result = await this.dataSource
      .getRepository(AttendeeRedeemablePointsEntity)
      .createQueryBuilder('rps')
      .where('rps.attendee_id = :attendeeID', {
        attendeeID: attendeeID,
      })
      .leftJoinAndSelect(
        PrizeEntity,
        'prize',
        `prize.id = CAST(JSONB_EXTRACT_PATH_TEXT(rps.metaData, 'prize_id') AS BIGINT)`,
      )
      .leftJoinAndSelect(
        TicketPrizeEntity,
        'ticketsPrize',
        'ticketsPrize.prize_id = prize.id',
      )
      .getRawMany();

    return GetAttendeeRpsHistorySerializer.serializeList(result);
  }

  async getAttendeePrizes(attendeeID: number) {
    const prizes = await this.dataSource
      .getRepository(AttendeePrizeEntity)
      .createQueryBuilder('attendeePrize')
      .where('attendeePrize.attendee_id = :attendeeID', {
        attendeeID: attendeeID,
      })
      .leftJoinAndSelect('attendeePrize.prize', 'prize')
      .leftJoinAndSelect('prize.type', 'type')
      .getMany();

    return await Promise.all(
      prizes.map(async (prize) => {
        if (Number(prize.prize.type_id) === Number(PrizeTypesEnum.TICKETS)) {
          const tickets = await this.dataSource
            .getRepository(TicketPrizeEntity)
            .createQueryBuilder()
            .where('prize_id = :prizeID', { prizeID: prize.prize.id })
            .getOneOrFail();

          return { ...prize, prize_details: tickets };
        }

        return prize;
      }),
    );
  }
}
