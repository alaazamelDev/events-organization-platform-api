import { Controller, Get } from '@nestjs/common';
import { GamificationService } from '../services/gamification.service';

@Controller('gamification')
export class GamificationController {
  constructor(private readonly gamificationService: GamificationService) {}

  @Get('defined-data')
  async getDefinedData() {
    return this.gamificationService.getDefinedData();
  }
}
