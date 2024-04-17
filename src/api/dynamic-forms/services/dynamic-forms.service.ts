import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Form } from '../entities/form.entity';
import { CreateFormDto } from '../dto/create-form/create-form.dto';
import { Organization } from '../../organization/entities/organization.entity';
import { UpdateFormDto } from '../dto/update-form/update-form.dto';
import { DynamicFormsGroupsService } from './dynamic-forms-groups.service';

// TODO, write seeders
@Injectable()
export class DynamicFormsService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Form)
    private readonly formRepository: Repository<Form>,
    private readonly dynamicFormsGroupsService: DynamicFormsGroupsService,
  ) {}

  async createForm(createFormDto: CreateFormDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    await queryRunner.startTransaction();

    try {
      const form = this.formRepository.create({
        name: createFormDto.name,
        description: createFormDto.description,
        organization: { id: createFormDto.organization_id } as Organization,
      });

      await queryRunner.manager.save(form, { reload: true });

      await Promise.all(
        createFormDto.groups
          .sort((groupA, groupB) =>
            groupA.position <= groupB.position ? -1 : 1,
          )
          .map(async (group, index) => {
            await this.dynamicFormsGroupsService.createGroup(
              { ...group, form_id: form.id, position: index + 1 },
              queryRunner,
            );
          }),
      );

      await queryRunner.commitTransaction();
      await queryRunner.release();

      return form;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      throw e;
    }
  }

  async updateForm(id: number, updateFormDto: UpdateFormDto) {
    const form = await this.formRepository.findOneOrFail({
      where: { id: id },
    });

    Object.assign(form, updateFormDto);

    await this.formRepository.save(form, { reload: true });

    return form;
  }

  async getForm(id: number) {
    return await this.formRepository.findOneOrFail({
      where: { id: id },
      relations: {
        groups: {
          fields: {
            options: true,
            fieldType: { fieldTypeOperators: { query_operator: true } },
          },
        },
      },
    });
  }

  async deleteForm(id: number) {
    return await this.formRepository.softDelete({ id });
  }

  async getOrganizationForms(id: number) {
    return await this.formRepository.find({
      where: { organization: { id: id } },
    });
  }
}
