import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrganizationReport } from './entities/organization-report.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateOrganizationReportType } from './types/create-organization-report.type';
import { CreateOrganizationReportTransformer } from './transformers/create-organization-report.transformer';

@Injectable()
export class OrganizationReportService {
  constructor(
    @InjectRepository(OrganizationReport)
    private readonly repository: Repository<OrganizationReport>,
    private readonly dataSource: DataSource,
  ) {}

  findOne(id: number) {
    return this.repository.findOneOrFail({
      where: { id },
      relations: {
        event: true,
        message: true,
        reporter: true,
        abuseType: true,
      },
    });
  }

  async createReport(data: CreateOrganizationReportType) {
    // transform the result
    const transformedPayload =
      CreateOrganizationReportTransformer.transform(data);

    // create the report...
    const created = this.repository.create(transformedPayload!);

    // save it
    const saved = await this.repository.save(created);
    return this.findOne(saved.id);
  }
}
