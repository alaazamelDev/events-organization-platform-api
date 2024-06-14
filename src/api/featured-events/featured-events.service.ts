import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FeaturedEvent } from './entities/featured-event.entity';
import { Repository } from 'typeorm';
import { CreateFeaturedEventDto } from './dto/create-featured-event.dto';
import { Event } from '../event/entities/event.entity';
import { FeaturedEventType } from './entities/featured-event-type.entity';

@Injectable()
export class FeaturedEventsService {
  constructor(
    @InjectRepository(FeaturedEvent)
    private readonly featuredEventRepository: Repository<FeaturedEvent>,
  ) {}

  async getFeaturedEvents() {
    return await this.featuredEventRepository.find({
      // where: {
      //   endDate: MoreThanOrEqual(new Date()),
      // },
      relations: { event: { organization: true }, type: true },
    });
  }

  async createFeaturedEvent(createFeaturedEventDto: CreateFeaturedEventDto) {
    const featured_event = this.featuredEventRepository.create({
      event: { id: createFeaturedEventDto.event_id } as Event,
      startDate: createFeaturedEventDto.start_date,
      endDate: createFeaturedEventDto.end_date,
      type: { id: createFeaturedEventDto.type_id } as FeaturedEventType,
    });

    await this.featuredEventRepository.save(featured_event, { reload: true });

    return featured_event;
  }

  async deleteFeaturedEvent(featuredEventID: number) {
    return this.featuredEventRepository.delete(featuredEventID);
  }
}
