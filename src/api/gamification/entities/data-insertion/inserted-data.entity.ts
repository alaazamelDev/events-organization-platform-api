import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../../common/entities/base.entity';
import { DefinedDataEntity } from '../data-definition/defined-data.entity';
import { Attendee } from '../../../attendee/entities/attendee.entity';
import { RewardedDataEntity } from '../rules/rewarded-data.entity';

@Entity({ name: 'g_inserted_data' })
export class InsertedDataEntity extends BaseEntity {
  @Column()
  value: number;

  @ManyToOne(() => DefinedDataEntity, (definedData) => definedData.insertedData)
  @JoinColumn({ name: 'defined_data_id' })
  definedData: DefinedDataEntity;

  @ManyToOne(() => Attendee, (attendee) => attendee.insertedData)
  @JoinColumn({ name: 'attendee_id' })
  attendee: Attendee;

  @OneToMany(
    () => RewardedDataEntity,
    (rewardedDataEntity) => rewardedDataEntity.insertedData,
  )
  rewardedRules: RewardedDataEntity[];

  @Column({ name: 'defined_data_id' })
  defined_data_id: number;

  @Column({ name: 'attendee_id' })
  attendee_id: number;
}
