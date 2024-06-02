import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { RewardedDataEntity } from '../entities/rules/rewarded-data.entity';

@Injectable()
export class GamificationRewardedDataService {
  constructor(private readonly dataSource: DataSource) {}

  async getRuleRewardedValue(
    rule_id: number,
    defined_data_id: number,
    attendee_id: number,
  ) {
    return await this.dataSource
      .getRepository(RewardedDataEntity)
      .createQueryBuilder('data')
      .where('data.attendee = :attendeeID', { attendeeID: attendee_id })
      .andWhere('data.definedData = :definedDataID', {
        definedDataID: defined_data_id,
      })
      .andWhere('data.rule = :ruleID', { ruleID: rule_id })
      .getMany()
      .then((result) => result.reduce((acc, obj) => acc + obj.value, 0));
  }
}
