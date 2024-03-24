import { Injectable } from '@nestjs/common';
import { ApprovalStatus } from './entities/approval-status.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ApprovalStatusService {
  private readonly approvalStatusRepository: Repository<ApprovalStatus>;

  constructor(
    @InjectRepository(ApprovalStatus)
    approvalStatusRepository: Repository<ApprovalStatus>,
  ) {
    this.approvalStatusRepository = approvalStatusRepository;
  }

  async findAll(): Promise<ApprovalStatus[]> {
    return await this.approvalStatusRepository.find({
      select: { id: true, statusName: true },
    });
  }
}
