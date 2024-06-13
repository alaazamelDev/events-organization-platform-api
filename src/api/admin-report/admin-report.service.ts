import { Injectable } from '@nestjs/common';
import { AdminReport } from './entities/admin-report.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAdminReportTransformer } from './transformers/create-admin-report.transformer';
import { CreateAdminReportType } from './types/create-admin-report.type';

@Injectable()
export class AdminReportService {
  constructor(
    @InjectRepository(AdminReport)
    private readonly repository: Repository<AdminReport>,
  ) {}

  async findOne(id: number) {
    return this.repository.findOneOrFail({
      where: { id },
      relations: {
        event: true,
        reporter: true,
        platformProblem: true,
      },
    });
  }

  async createReport(payload: CreateAdminReportType) {
    // transform the result
    const transformedPayload = CreateAdminReportTransformer.transform(payload);

    // create the report...
    const created = this.repository.create(transformedPayload);

    // save it...
    const saved = await this.repository.save(created);

    return this.findOne(saved.id);
  }
}
