import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('jobs')
export class Job extends BaseEntity {
  @Column({
    name: 'job_name',
    type: 'varchar',
    nullable: false,
  })
  jobName: string;
}
