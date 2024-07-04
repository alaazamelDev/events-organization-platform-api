import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Tag } from '../../tag/entities/tag.entity';
import { EventTag } from '../../event/entities/event-tag.entity';
import { Event } from '../../event/entities/event.entity';
import { GenericFilter } from '../../../common/interfaces/query.interface';

@Injectable()
export class FeedCategoriesService {
  constructor(private readonly dataSource: DataSource) {}

  async getAllCategories() {
    return await this.dataSource
      .getRepository(Tag)
      .createQueryBuilder('tags')
      .select(['tags.id', 'tags.tagName'])
      .getMany();
  }

  async getEventsWithSpecifiedCategories(
    query: GenericFilter,
    categories: string[],
  ) {
    const subQuery = this.dataSource
      .getRepository(EventTag)
      .createQueryBuilder('event_tag')
      .select('event_tag.event.id', 'eventId')
      .where('event_tag.tag IN (:...ids)', { ids: categories });

    const [events, count] = await this.dataSource
      .getRepository(Event)
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.tags', 'event_tag')
      .leftJoinAndSelect('event.organization', 'organization')
      .where(`event.id IN (${subQuery.getQuery()})`)
      .setParameters(subQuery.getParameters())
      .skip((query.page - 1) * query.pageSize)
      .take(query.pageSize)
      .getManyAndCount();

    return { events, count };
  }
}
