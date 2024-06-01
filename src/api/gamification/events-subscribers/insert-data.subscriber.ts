import { DataSource, EntitySubscriberInterface, InsertEvent } from 'typeorm';
import { InsertedDataEntity } from '../entities/data-insertion/inserted-data.entity';
import { EvaluateRules } from '../rules-evaluation/evaluate-rules';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class InsertDataSubscriber
  implements EntitySubscriberInterface<InsertedDataEntity>
{
  constructor(
    private readonly dataSource: DataSource,
    @Inject(EvaluateRules) private readonly evaluateRules: EvaluateRules,
  ) {
    this.dataSource.subscribers.push(this);
  }

  listenTo(): Function | string {
    return InsertedDataEntity;
  }

  async afterInsert(event: InsertEvent<InsertedDataEntity>): Promise<any> {
    await this.evaluateRules.evaluateRules(event.entity.attendee_id);
  }
}
