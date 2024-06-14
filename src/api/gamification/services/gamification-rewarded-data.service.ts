import { Injectable } from '@nestjs/common';
import { QueryRunner } from 'typeorm';
import { RewardedDataEntity } from '../entities/rules/rewarded-data.entity';

@Injectable()
export class GamificationRewardedDataService {
  constructor() {}

  async getRuleRewardedValue(
    rule_id: number,
    defined_data_id: number,
    attendee_id: number,
    queryRunner: QueryRunner,
  ) {
    return await queryRunner.manager
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
