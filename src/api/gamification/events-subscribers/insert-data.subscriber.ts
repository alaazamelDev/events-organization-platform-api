import { DataSource, EntitySubscriberInterface, InsertEvent } from 'typeorm';
import { InsertedDataEntity } from '../entities/data-insertion/inserted-data.entity';
import { ExecuteRules } from '../rules-evaluation/execute-rules';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class InsertDataSubscriber
  implements EntitySubscriberInterface<InsertedDataEntity>
{
  constructor(
    private readonly dataSource: DataSource,
    @Inject(ExecuteRules) private readonly evaluateRules: ExecuteRules,
  ) {
    this.dataSource.subscribers.push(this);
  }

  listenTo(): Function | string {
    return InsertedDataEntity;
  }

  async afterInsert(event: InsertEvent<InsertedDataEntity>): Promise<any> {
    await this.evaluateRules.executeRules(
      event.entity.attendee_id,
      event.queryRunner,
    );
  }
}
