import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { FieldTypeOperatorsEntity } from './field-type-operators.entity';

@Entity({ name: 'operators' })
export class QueryOperator extends BaseEntity {
  @Column()
  name: string;

  @Column()
  value: string;

  @OneToMany(
    () => FieldTypeOperatorsEntity,
    (fieldTypeOperators) => fieldTypeOperators.query_operator,
  )
  fieldTypeOperators: FieldTypeOperatorsEntity[];
}
