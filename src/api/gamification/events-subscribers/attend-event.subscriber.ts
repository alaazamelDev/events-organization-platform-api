import { DataSource, EntitySubscriberInterface, UpdateEvent } from 'typeorm';
import { InsertedDataEntity } from '../entities/data-insertion/inserted-data.entity';
import { DefinedDataEnum } from '../constants/defined-data.constant';
import { Injectable } from '@nestjs/common';
import { AttendanceDay } from '../../attendance/entities/attendance-day.entity';
import { AttendanceStatus } from '../../attendance/enums/attendance-status.enum';

@Injectable()
export class AttendEventSubscriber
  implements EntitySubscriberInterface<AttendanceDay>
{
  constructor(private readonly dataSource: DataSource) {
    this.dataSource.subscribers.push(this);
  }

  listenTo(): Function | string {
    return AttendanceDay;
  }

  async afterUpdate(event: UpdateEvent<AttendanceDay>): Promise<any> {
    const object = event.entity as AttendanceDay;
    const id = object.id;

    const attendObject = await this.dataSource
      .getRepository(AttendanceDay)
      .createQueryBuilder('attend')
      .where('attend.id = :attendID', {
        attendID: id,
      })
      .getOneOrFail();

    const attendedEvent = await this.dataSource
      .getRepository(AttendanceDay)
      .createQueryBuilder('attend')
      .where('attend.attendee = :attendeeID', {
        attendeeID: attendObject.attendeeId,
      })
      .andWhere('attend.event = :eventID', { eventID: attendObject.eventId })
      .andWhere('attend.status = :status', {
        status: AttendanceStatus.attended,
      })
      .getExists();

    if (!attendedEvent) {
      await event.queryRunner.manager.getRepository(InsertedDataEntity).insert({
        attendee_id: +attendObject.attendeeId,
        defined_data_id: DefinedDataEnum.ATTEND_EVENT,
        value: 1,
      });
    }
  }
}
