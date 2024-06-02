import { Injectable } from '@nestjs/common';
import { OperatorsEnum } from '../constants/operators.constant';
import { OperatorStrategy } from './operators-strategies/operator.strategy.interface';
import { EqualStrategy } from './operators-strategies/equal.strategy';
import { GreaterStrategy } from './operators-strategies/greater.strategy';
import { SmallerStrategy } from './operators-strategies/smaller.strategy';

@Injectable()
export class OperatorService {
  private readonly strategies: { [key: string]: OperatorStrategy };

  constructor() {
    this.strategies = {
      [OperatorsEnum.Equal]: new EqualStrategy(),
      [OperatorsEnum.Greater]: new GreaterStrategy(),
      [OperatorsEnum.Smaller]: new SmallerStrategy(),
    };
  }

  getStrategy(operator: OperatorsEnum) {
    return this.strategies[operator];
  }
}
