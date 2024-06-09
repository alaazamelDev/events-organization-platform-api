import { OperatorStrategy } from './operator.strategy.interface';
import { InsertedDataEntity } from '../../entities/data-insertion/inserted-data.entity';

export class SmallerStrategy implements OperatorStrategy {
  evaluate(
    data: InsertedDataEntity[],
    target: number,
    _rewarded: number,
  ): boolean {
    const result = data.reduce((acc, obj) => acc + obj.value, 0);

    return result < target;
  }
}
