import { GamificationAttendeeService } from '../services/gamification-attendee.service';
import { Controller, Get, Param } from '@nestjs/common';

@Controller('gamification/attendee')
export class GamificationAttendeeController {
  constructor(
    private readonly gamificationAttendeeService: GamificationAttendeeService,
  ) {}

  @Get(':id/prizes')
  getAttendeePrizes(@Param('id') attendeeID: string) {
    return this.gamificationAttendeeService.getAttendeePrizes(+attendeeID);
  }

  @Get(':id/badges')
  getAttendeeBadges(@Param('id') attendeeID: string) {
    return this.gamificationAttendeeService.getAttendeeBadges(+attendeeID);
  }

  @Get(':id/badges-history')
  getAttendeeBadgesHistory(@Param('id') attendeeID: string) {
    return this.gamificationAttendeeService.getAttendeeBadgesHistory(
      +attendeeID,
    );
  }

  @Get(':id/points')
  getAttendeePoints(@Param('id') attendeeID: string) {
    return this.gamificationAttendeeService.getAttendeePoints(+attendeeID);
  }

  @Get(':id/points-history')
  getAttendeePointsHistory(@Param('id') attendeeID: string) {
    return this.gamificationAttendeeService.getAttendeePointsHistory(
      +attendeeID,
    );
  }

  @Get(':id/redeemable-points')
  getAttendeeRedeemablePoints(@Param('id') attendeeID: string) {
    return this.gamificationAttendeeService.getAttendeeRedeemablePoints(
      +attendeeID,
    );
  }

  @Get(':id/redeemable-points-history')
  getAttendeeRedeemablePointsHistory(@Param('id') attendeeID: string) {
    return this.gamificationAttendeeService.getAttendeeRedeemablePointsHistory(
      +attendeeID,
    );
  }
}
