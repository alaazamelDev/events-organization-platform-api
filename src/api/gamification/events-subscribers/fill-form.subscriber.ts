import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import { FilledForm } from '../../dynamic-forms/entities/filled-form.entity';
import { InsertedDataEntity } from '../entities/data-insertion/inserted-data.entity';
import { DefinedDataEnum } from '../constants/defined-data.constant';

@EventSubscriber()
export class FillFormSubscriber
  implements EntitySubscriberInterface<FilledForm>
{
  listenTo() {
    return FilledForm;
  }

  async afterInsert(event: InsertEvent<FilledForm>): Promise<any> {
    const form = event.entity;
    const attendee_id = form.attendee.id;

    await event.queryRunner.manager.getRepository(InsertedDataEntity).insert({
      attendee_id: attendee_id,
      defined_data_id: DefinedDataEnum.FILL_FORM,
      value: 1,
    });
  }
}
