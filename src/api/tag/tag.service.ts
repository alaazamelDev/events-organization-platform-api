import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Tag } from './entities/tag.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TagService {
  // Data Access Layer interface
  private readonly tagRepository: Repository<Tag>;

  constructor(
    @InjectRepository(Tag)
    tagRepository: Repository<Tag>,
  ) {
    this.tagRepository = tagRepository;
  }

  async findAll(): Promise<Tag[]> {
    return await this.tagRepository.find({
      select: { id: true, tagName: true },
    });
  }
}
