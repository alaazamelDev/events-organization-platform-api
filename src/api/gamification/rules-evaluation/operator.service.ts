import { Injectable } from '@nestjs/common';
import { OperatorsEnum } from '../constants/operators.constant';
import { OperatorStrategy } from './operators-strategies/operator.strategy.interface';
import { EqualStrategy } from './operators-strategies/equal.strategy';

@Injectable()
export class OperatorService {
  private readonly strategies: { [key: string]: OperatorStrategy };

  constructor() {
    this.strategies = {
      [OperatorsEnum.Equal]: new EqualStrategy(),
    };
  }

  getStrategy(operator: OperatorsEnum) {
    return this.strategies[operator];
  }
}
