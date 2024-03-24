import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { FieldTypeOperators } from './field-type.operators';

@Entity({ name: 'operators' })
export class QueryOperator extends BaseEntity {
  @Column()
  name: string;

  @Column()
  value: string;

  @OneToMany(
    () => FieldTypeOperators,
    (fieldTypeOperators) => fieldTypeOperators.query_operator,
  )
  fieldTypeOperators: FieldTypeOperators[];
}
