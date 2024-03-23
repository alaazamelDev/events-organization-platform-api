import { BaseEntity } from '../../../common/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('tags')
export class Tag extends BaseEntity {
  @Column({
    name: 'tag_name',
    type: 'varchar',
    nullable: false,
  })
  tagName: string;
}
