import { Injectable } from '@nestjs/common';
import { RedeemStrategy } from '../redeem-prize-strategies/redeem.strategy.interface';
import { PrizeTypesEnum } from '../constants/prize-types.constant';
import { RedeemTicketsPrizeStrategy } from '../redeem-prize-strategies/redeem-tickets-prize.strategy';
import { DataSource } from 'typeorm';

@Injectable()
export class RedeemService {
  private readonly strategies: { [key: string]: RedeemStrategy };

  constructor(private readonly dataSource: DataSource) {
    this.strategies = {
      [PrizeTypesEnum.TICKETS]: new RedeemTicketsPrizeStrategy(this.dataSource),
    };
  }

  getStrategy(prize: PrizeTypesEnum) {
    return this.strategies[prize];
  }
}
