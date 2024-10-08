import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FieldType } from './field-type.entity';
import { QueryOperator } from './query-operator';

@Entity({ name: 'field_type_operators' })
export class FieldTypeOperatorsEntity {
  @PrimaryGeneratedColumn({
    name: 'id',
    type: 'bigint',
    unsigned: true,
  })
  id!: number;

  @ManyToOne(() => FieldType)
  @JoinColumn({ name: 'field_type_id' })
  field_type: FieldType;

  @ManyToOne(
    () => QueryOperator,
    (queryOperator) => queryOperator.fieldTypeOperators,
  )
  @JoinColumn({ name: 'query_operator_id' })
  query_operator: QueryOperator;

  @Column({ name: 'field_type_id' })
  field_type_id: number;

  @Column({ name: 'query_operator_id' })
  query_operator_id: number;
}
