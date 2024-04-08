import { Injectable } from '@nestjs/common';
import { FormGroup } from '../entities/form-group.entity';
import { DataSource, Not, QueryRunner, Repository } from 'typeorm';
import { Form } from '../entities/form.entity';
import { AddGroupDto } from '../dto/update-form/add-group.dto';
import { UpdateFormGroupDto } from '../dto/update-form/update-form-group.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DynamicFormsFieldsService } from './dynamic-forms-fields.service';

@Injectable()
export class DynamicFormsGroupsService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(FormGroup)
    private readonly formGroupRepository: Repository<FormGroup>,
    private readonly dynamicFormsFieldsService: DynamicFormsFieldsService,
  ) {}

  async addGroup(addGroupDto: AddGroupDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    await queryRunner.startTransaction();

    try {
      const group = await this.createGroup(addGroupDto, queryRunner);

      await this.handleGroupPosition(group, addGroupDto.form_id);

      await queryRunner.commitTransaction();

      return group;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    }
  }

  async handleGroupPosition(group: FormGroup, formID: number) {
    const groups = await this.formGroupRepository.find({
      where: {
        id: Not(group.id),
        form: { id: formID } as Form,
      },
      order: {
        position: 'ASC',
      },
    });

    let before = group.position - 1;
    let position = 1;

    await Promise.all(
      groups.map(async (g) => {
        if (before == 0) {
          position = group.position + 1;
        }

        g.position = position;
        position++;
        before--;

        await this.formGroupRepository.save(g);
      }),
    );
  }

  async createGroup(addGroupDto: AddGroupDto, queryRunner: QueryRunner) {
    const createdGroup = this.formGroupRepository.create({
      name: addGroupDto.name,
      description: addGroupDto.description,
      position: addGroupDto.position,
      form: { id: addGroupDto.form_id } as Form,
    });
    await queryRunner.manager.save(createdGroup, { reload: true });

    await Promise.all(
      addGroupDto.fields.map(async (field) => {
        await this.dynamicFormsFieldsService.createField(
          field,
          createdGroup.id,
          queryRunner,
        );
      }),
    );

    return createdGroup;
  }

  async updateFormGroup(id: number, updateFormGroupDto: UpdateFormGroupDto) {
    const group = await this.formGroupRepository.findOneOrFail({
      where: { id: id },
      relations: {
        form: true,
      },
    });

    Object.assign(group, updateFormGroupDto);

    await this.formGroupRepository.save(group, { reload: true });

    await this.handleGroupPosition(group, group.form.id);

    return group;
  }

  async deleteGroup(id: number) {
    return await this.formGroupRepository.softDelete({ id });
  }
}
