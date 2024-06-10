import { BaseEntity } from '../../../../common/entities/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { InsertedDataEntity } from '../data-insertion/inserted-data.entity';
import { OperatorEntity } from './operator.entity';
import { DefinedDataOperatorsEntity } from './defined-data-operators.entity';

@Entity({ name: 'g_defined_data' })
export class DefinedDataEntity extends BaseEntity {
  @Column()
  name: string;

  @OneToMany(
    () => InsertedDataEntity,
    (insertedDataEntity) => insertedDataEntity.definedData,
  )
  insertedData: InsertedDataEntity[];

  @OneToMany(
    () => DefinedDataOperatorsEntity,
    (definedDataOperatorsEntity) => definedDataOperatorsEntity.definedData,
  )
  operators: DefinedDataOperatorsEntity[];
}
