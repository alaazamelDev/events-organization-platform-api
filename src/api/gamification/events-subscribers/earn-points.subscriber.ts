import { DataSource, EntitySubscriberInterface, InsertEvent } from 'typeorm';
import { InsertedDataEntity } from '../entities/data-insertion/inserted-data.entity';
import { DefinedDataEnum } from '../constants/defined-data.constant';
import { Injectable } from '@nestjs/common';
import { AttendeePointsEntity } from '../entities/rewards-attendee/attendee-points.entity';

@Injectable()
export class EarnPointsSubscriber
  implements EntitySubscriberInterface<AttendeePointsEntity>
{
  constructor(private readonly dataSource: DataSource) {
    this.dataSource.subscribers.push(this);
  }

  listenTo(): Function | string {
    return AttendeePointsEntity;
  }

  async afterInsert(event: InsertEvent<AttendeePointsEntity>): Promise<any> {
    const attendeePoints = event.entity;

    await event.queryRunner.manager.getRepository(InsertedDataEntity).insert({
      attendee_id: attendeePoints.attendeeID,
      defined_data_id: DefinedDataEnum.EARN_POINTS,
      value: attendeePoints.value,
    });
  }
}
