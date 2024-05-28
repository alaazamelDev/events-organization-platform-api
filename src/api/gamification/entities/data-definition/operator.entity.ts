import { BaseEntity } from '../../../../common/entities/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { DefinedDataEntity } from './defined-data.entity';
import { DefinedDataOperatorsEntity } from './defined-data-operators.entity';

@Entity({ name: 'g_operators' })
export class OperatorEntity extends BaseEntity {
  @Column()
  name: string;

  @OneToMany(
    () => DefinedDataOperatorsEntity,
    (definedDataOperatorsEntity) => definedDataOperatorsEntity.operator,
  )
  definedData: DefinedDataOperatorsEntity[];
}
