import { BaseEntity } from '../../../../common/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { DefinedDataEntity } from './defined-data.entity';
import { OperatorEntity } from './operator.entity';

@Entity({ name: 'g_data_operators' })
export class DefinedDataOperatorsEntity extends BaseEntity {
  @ManyToOne(
    () => DefinedDataEntity,
    (definedDataEntity) => definedDataEntity.operators,
  )
  @JoinColumn({ name: 'defined_data_id' })
  definedData: DefinedDataEntity;

  @ManyToOne(
    () => OperatorEntity,
    (operatorEntity) => operatorEntity.definedData,
  )
  @JoinColumn({ name: 'operator_id' })
  operator: OperatorEntity;

  @Column({ name: 'defined_data_id' })
  defined_data_id: number;

  @Column({ name: 'operator_id' })
  operator_id: number;
}
