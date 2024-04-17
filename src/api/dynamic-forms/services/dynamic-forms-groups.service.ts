import { Injectable } from '@nestjs/common';
import { FormGroup } from '../entities/form-group.entity';
import { DataSource, Not, QueryRunner, Repository } from 'typeorm';
import { Form } from '../entities/form.entity';
import { AddGroupDto } from '../dto/update-form/add-group.dto';
import { UpdateFormGroupDto } from '../dto/update-form/update-form-group.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DynamicFormsFieldsService } from './dynamic-forms-fields.service';
import { CreateFormGroupDto } from '../dto/create-form/create-form-group.dto';

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
      const position = await this.getGroupPosition(
        addGroupDto.position,
        addGroupDto.form_id,
      );

      const group = await this.createGroup(
        { ...addGroupDto, position: position },
        queryRunner,
      );

      await this.handleGroupPosition(group, addGroupDto.form_id);

      await queryRunner.commitTransaction();
      await queryRunner.release();

      return group;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();

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
      addGroupDto.fields
        .sort((fieldA, fieldB) => (fieldA.position <= fieldB.position ? -1 : 1))
        .map(async (field, index) => {
          await this.dynamicFormsFieldsService.createField(
            { ...field, position: index + 1 },
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

    if (updateFormGroupDto.position) {
      const position = await this.getGroupPosition(
        updateFormGroupDto.position,
        group.form.id,
      );

      Object.assign(group, { ...updateFormGroupDto, position: position });
    } else {
      Object.assign(group, updateFormGroupDto);
    }

    await this.formGroupRepository.save(group, { reload: true });

    await this.handleGroupPosition(group, group.form.id);

    return group;
  }

  async deleteGroup(id: number) {
    return await this.formGroupRepository.softDelete({ id });
  }

  private async getGroupPosition(position: number, form_id: number) {
    const lastPosition = await this.formGroupRepository
      .findOne({
        where: { form: { id: form_id } },
        order: { position: 'DESC' },
      })
      .then((group) => (group ? group.position : 0));

    if (position > lastPosition) {
      return lastPosition + 1;
    }

    return position;
  }
}
