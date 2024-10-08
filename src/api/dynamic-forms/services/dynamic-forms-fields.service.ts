import { Injectable } from '@nestjs/common';
import { UpdateFormFieldDto } from '../dto/update-form/update-form-field.dto';
import { CreateFormFieldDto } from '../dto/create-form/create-form-field.dto';
import { FormField } from '../entities/form-field.entity';
import { DataSource, Not, QueryRunner, Repository } from 'typeorm';
import { FormGroup } from '../entities/form-group.entity';
import { FieldType } from '../entities/field-type.entity';
import { FieldOption } from '../entities/field-option.entity';
import {
  fieldTypesWithOptions,
  fieldTypesWithValidationRules,
} from '../constants/constants';
import { ValidationRule } from '../entities/validation-rule.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AddOptionDto } from '../dto/update-form/add-option.dto';
import { FilledFormField } from '../entities/filled-form-field.entity';
import { UpdateOptionNameDto } from '../dto/update-form/update-option-name.dto';

@Injectable()
export class DynamicFormsFieldsService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(FormField)
    private readonly formFieldRepository: Repository<FormField>,
    @InjectRepository(FieldOption)
    private readonly fieldOptionRepository: Repository<FieldOption>,
    @InjectRepository(ValidationRule)
    private readonly validationRuleRepository: Repository<ValidationRule>,
    @InjectRepository(FieldType)
    private readonly fieldTypeRepository: Repository<FieldType>,
    @InjectRepository(FilledFormField)
    private readonly filledFormFieldRepository: Repository<FilledFormField>,
  ) {}

  async addField(groupID: number, createFormFieldDto: CreateFormFieldDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const position = await this.calcFieldPosition(
        createFormFieldDto.position,
        groupID,
      );
      const field = await this.createField(
        { ...createFormFieldDto, position: position },
        groupID,
        queryRunner,
      );

      await this.handleFieldPosition(field, groupID);

      await queryRunner.commitTransaction();
      await queryRunner.release();

      return field;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      throw e;
    }
  }

  async updateFormField(
    fieldID: number,
    updateFormFieldDto: UpdateFormFieldDto,
  ) {
    const field = await this.formFieldRepository.findOneOrFail({
      where: { id: fieldID },
      relations: {
        group: true,
      },
    });

    if (updateFormFieldDto.position) {
      const position = await this.calcFieldPosition(
        updateFormFieldDto.position,
        field.group.id,
      );

      Object.assign(field, { ...updateFormFieldDto, position: position });
    } else {
      Object.assign(field, updateFormFieldDto);
    }

    if (updateFormFieldDto.group_id) {
      field.group = { id: updateFormFieldDto.group_id } as FormGroup;
    }

    await this.formFieldRepository.save(field, { reload: true });

    await this.handleFieldPosition(field, field.group.id);

    return field;
  }

  async handleFieldPosition(field: FormField, groupID: number) {
    const fields = await this.formFieldRepository.find({
      where: {
        id: Not(field.id),
        group: { id: groupID } as FormGroup,
      },
      order: {
        position: 'ASC',
      },
    });

    let before = field.position - 1;
    let position = 1;

    await Promise.all(
      fields.map(async (f) => {
        if (before == 0) {
          position = field.position + 1;
        }

        f.position = position;
        position++;
        before--;

        await this.formFieldRepository.save(f);
      }),
    );
  }

  async createField(
    createFormFieldDto: CreateFormFieldDto,
    groupID: number,
    queryRunner: QueryRunner,
  ) {
    const field = this.formFieldRepository.create({
      name: createFormFieldDto.name,
      label: createFormFieldDto.label,
      position: createFormFieldDto.position,
      required: createFormFieldDto.required,
      fieldType: { id: createFormFieldDto.type_id } as FieldType,
      group: { id: groupID } as FormGroup,
    });

    await queryRunner.manager.save(field, { reload: true });

    if (fieldTypesWithOptions.includes(+createFormFieldDto.type_id)) {
      field.options = await Promise.all(
        createFormFieldDto.options.map(async (op) => {
          const option = this.fieldOptionRepository.create({
            name: op.name,
            formField: field,
          });

          await queryRunner.manager.save(option);

          return new FieldOption({ id: option.id, name: option.name });
        }),
      );
    }

    if (fieldTypesWithValidationRules.includes(+createFormFieldDto.type_id)) {
      field.validationRules = await Promise.all(
        createFormFieldDto.validation_rules.map(async (vr) => {
          const rule = this.validationRuleRepository.create({
            rule: vr.rule,
            value: vr.value,
            formField: field,
          });

          await queryRunner.manager.save(rule, { reload: true });

          return new ValidationRule(rule);
        }),
      );
    }

    return field;
  }

  async deleteField(id: number) {
    return await this.formFieldRepository.softDelete({ id });
  }

  async addOptionToField(addOptionDto: AddOptionDto) {
    const option = this.fieldOptionRepository.create({
      name: addOptionDto.name,
      formField: { id: addOptionDto.field_id } as FormField,
    });

    await this.fieldOptionRepository.save(option, { reload: true });

    return option;
  }

  async deleteFieldOption(optionID: number) {
    return await this.fieldOptionRepository.softDelete(optionID);
  }

  async updateFieldOptionName(updateOptionName: UpdateOptionNameDto) {
    const queryRunner = await this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const option = await this.fieldOptionRepository.findOneOrFail({
        where: { id: updateOptionName.option_id },
      });

      option.name = updateOptionName.name;

      await queryRunner.manager.save(option, { reload: true });

      const filled_fields = await this.filledFormFieldRepository.find({
        where: { option: { id: option.id } },
      });

      await Promise.all(
        filled_fields.map(async (f) => {
          f.value = updateOptionName.name;
          await queryRunner.manager.save(f);
        }),
      );

      await queryRunner.commitTransaction();
      return option;
    } catch (e) {
      await queryRunner.rollbackTransaction();

      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async getFieldsTypes() {
    return await this.fieldTypeRepository.find({
      relations: {
        fieldTypeOperators: { query_operator: true },
      },
    });
  }

  private async calcFieldPosition(position: number, group_id: number) {
    const lastPosition = await this.formFieldRepository
      .findOne({
        where: { group: { id: group_id } },
        order: { position: 'DESC' },
      })
      .then((field) => (field ? field.position : 0));

    if (position > lastPosition) {
      return lastPosition + 1;
    }

    return position;
  }
}
