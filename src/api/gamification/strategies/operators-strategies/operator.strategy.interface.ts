import { InsertedDataEntity } from '../../entities/data-insertion/inserted-data.entity';

export interface OperatorStrategy {
  evaluate(
    data: InsertedDataEntity[],
    target: number,
    rewarded: number,
  ): boolean;
}
