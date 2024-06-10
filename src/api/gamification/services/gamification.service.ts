import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DefinedDataEntity } from '../entities/data-definition/defined-data.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GamificationService {
  constructor(
    @InjectRepository(DefinedDataEntity)
    private readonly definedDataRepository: Repository<DefinedDataEntity>,
  ) {}

  async getDefinedData() {
    return this.definedDataRepository.find({
      relations: { operators: { operator: true } },
    });
  }
}
