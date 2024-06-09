import { OperatorStrategy } from './operator.strategy.interface';
import { InsertedDataEntity } from '../../entities/data-insertion/inserted-data.entity';

export class EqualStrategy implements OperatorStrategy {
  evaluate(
    data: InsertedDataEntity[],
    target: number,
    rewarded: number,
  ): boolean {
    const result = data.reduce((acc, obj) => acc + obj.value, 0);

    return result - rewarded >= target;
  }
}
