import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AgeGroup } from './entities/age-group.entity';

@Injectable()
export class AgeGroupService {
  private readonly ageGroupRepository: Repository<AgeGroup>;

  constructor(
    @InjectRepository(AgeGroup)
    ageGroupRepository: Repository<AgeGroup>,
  ) {
    this.ageGroupRepository = ageGroupRepository;
  }

  async findAll(): Promise<AgeGroup[]> {
    return await this.ageGroupRepository.find({
      select: { id: true, fromAge: true, toAge: true },
    });
  }
}
