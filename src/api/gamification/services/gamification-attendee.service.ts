import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AttendeeBadgeEntity } from '../entities/rewards-attendee/attendee-badge.entity';
import { AttendeePointsEntity } from '../entities/rewards-attendee/attendee-points.entity';
import { AttendeeRedeemablePointsEntity } from '../entities/rewards-attendee/attendee-redeemable-points.entity';

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
    return await this.dataSource
      .getRepository(AttendeeRedeemablePointsEntity)
      .createQueryBuilder('attendeePoints')
      .where('attendeePoints.attendee_id = :attendeeID', {
        attendeeID: attendeeID,
      })
      .getMany();
  }
}
