import { Injectable } from '@nestjs/common';
import { QueryRunner } from 'typeorm';
import { InsertedDataEntity } from '../entities/data-insertion/inserted-data.entity';

@Injectable()
export class GamificationInsertedDataService {
  constructor() {}

  async getInsertedData(
    attendee_id: number,
    defined_data_id: number,
    _time: Date | null,
    queryRunner: QueryRunner,
  ) {
    const query = queryRunner.manager
      .getRepository(InsertedDataEntity)
      .createQueryBuilder('data')
      .where('data.attendee = :attendeeID', { attendeeID: attendee_id })
      .andWhere('data.definedData = :definedDataID', {
        definedDataID: defined_data_id,
      });

    // if (time !== null) {
    //   query.andWhere('data.createdAt <= :time', { time: new Date(time) });
    // }

    return await query.getMany();
  }
}
