import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class GamificationAttendeeService {
  constructor(private readonly dataSource: DataSource) {}

  async getAttendeeBadges(attendeeID: number) {
    console.log(attendeeID);
  }
}
