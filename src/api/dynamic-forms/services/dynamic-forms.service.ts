import { Injectable } from '@nestjs/common';
import {
  DataSource,
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Not,
  QueryRunner,
  Repository,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Form } from '../entities/form.entity';
import { FormField } from '../entities/form-field.entity';
import { FieldOption } from '../entities/field-option.entity';
import { FieldType } from '../entities/field-type.entity';
import { CreateFormDto } from '../dto/create-form/create-form.dto';
import { Organization } from '../../organization/entities/organization.entity';
import { UpdateFormDto } from '../dto/update-form/update-form.dto';
import { UpdateFormFieldDto } from '../dto/update-form/update-form-field.dto';
import { CreateFormFieldDto } from '../dto/create-form/create-form-field.dto';
import { FormGroup } from '../entities/form-group.entity';
import { UpdateFormGroupDto } from '../dto/update-form/update-form-group.dto';
import { ValidationRule } from '../entities/validation-rule.entity';
import { fieldTypesWithValidationRules } from '../constants/constants';
import { AddGroupDto } from '../dto/update-form/add-group.dto';
import { DynamicFormsGroupsService } from './dynamic-forms-groups.service';
import { DynamicFormsFieldsService } from './dynamic-forms-fields.service';

// TODO, write seeders
@Injectable()
export class DynamicFormsService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Form)
    private readonly formRepository: Repository<Form>,
    @InjectRepository(FormField)
    private readonly formFieldRepository: Repository<FormField>,
    @InjectRepository(FieldOption)
    private readonly fieldOptionRepository: Repository<FieldOption>,
    @InjectRepository(FormGroup)
    private readonly formGroupRepository: Repository<FormGroup>,
    @InjectRepository(FieldType)
    private readonly fieldTypeRepository: Repository<FieldType>,
    @InjectRepository(ValidationRule)
    private readonly validationRuleRepository: Repository<ValidationRule>,
    private readonly dynamicFormsGroupsService: DynamicFormsGroupsService,
    private readonly dynamicFormsFieldsService: DynamicFormsFieldsService,
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
        createFormDto.groups.map(async (group) => {
          await this.dynamicFormsGroupsService.createGroup(
            { ...group, form_id: form.id },
            queryRunner,
          );
        }),
      );

      await queryRunner.commitTransaction();

      return form;
    } catch (e) {
      console.log(e);
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

  // async updateFormField(id: number, updateFormFieldDto: UpdateFormFieldDto) {
  //   const field = await this.formFieldRepository.findOneOrFail({
  //     where: { id: id },
  //     relations: {
  //       group: true,
  //     },
  //   });
  //
  //   Object.assign(field, updateFormFieldDto);
  //
  //   await this.formFieldRepository.save(field, { reload: true });
  //
  //   await this.handleFieldPosition(field, field.group.id);
  //
  //   return field;
  // }
  //
  // async updateFormGroup(id: number, updateFormGroupDto: UpdateFormGroupDto) {
  //   const group = await this.formGroupRepository.findOneOrFail({
  //     where: { id: id },
  //     relations: {
  //       form: true,
  //     },
  //   });
  //
  //   Object.assign(group, updateFormGroupDto);
  //
  //   await this.formGroupRepository.save(group, { reload: true });
  //
  //   await this.handleGroupPosition(group, group.form.id);
  //
  //   return group;
  // }
  //
  // async addGroup(addGroupDto: AddGroupDto) {
  //   const queryRunner = this.dataSource.createQueryRunner();
  //   await queryRunner.connect();
  //
  //   await queryRunner.startTransaction();
  //
  //   try {
  //     const group = await this.createGroup(addGroupDto, queryRunner);
  //
  //     await this.handleGroupPosition(group, addGroupDto.form_id);
  //
  //     await queryRunner.commitTransaction();
  //
  //     return group;
  //   } catch (e) {
  //     await queryRunner.rollbackTransaction();
  //     throw e;
  //   }
  // }
  //
  // async addField(id: number, createFormFieldDto: CreateFormFieldDto) {
  //   const queryRunner = this.dataSource.createQueryRunner();
  //   await queryRunner.connect();
  //   await queryRunner.startTransaction();
  //
  //   try {
  //     const field = await this.createField(createFormFieldDto, id, queryRunner);
  //
  //     await this.handleFieldPosition(field, id);
  //
  //     await queryRunner.commitTransaction();
  //     await queryRunner.release();
  //
  //     return field;
  //   } catch (e) {
  //     await queryRunner.rollbackTransaction();
  //     await queryRunner.release();
  //
  //     throw e;
  //   }
  // }
  //
  // async handleFieldPosition(field: FormField, groupID: number) {
  //   const fields = await this.formFieldRepository.find({
  //     where: {
  //       id: Not(field.id),
  //       group: { id: groupID } as FormGroup,
  //     },
  //     order: {
  //       position: 'ASC',
  //     },
  //   });
  //
  //   let before = field.position - 1;
  //   let position = 1;
  //
  //   await Promise.all(
  //     fields.map(async (f) => {
  //       if (before == 0) {
  //         position = field.position + 1;
  //       }
  //
  //       f.position = position;
  //       position++;
  //       before--;
  //
  //       await this.formFieldRepository.save(f);
  //     }),
  //   );
  // }
  //
  // async handleGroupPosition(group: FormGroup, formID: number) {
  //   const groups = await this.formGroupRepository.find({
  //     where: {
  //       id: Not(group.id),
  //       form: { id: formID } as Form,
  //     },
  //     order: {
  //       position: 'ASC',
  //     },
  //   });
  //
  //   let before = group.position - 1;
  //   let position = 1;
  //
  //   await Promise.all(
  //     groups.map(async (g) => {
  //       if (before == 0) {
  //         position = group.position + 1;
  //       }
  //
  //       g.position = position;
  //       position++;
  //       before--;
  //
  //       await this.formGroupRepository.save(g);
  //     }),
  //   );
  // }
  //
  // async createGroup(addGroupDto: AddGroupDto, queryRunner: QueryRunner) {
  //   const createdGroup = this.formGroupRepository.create({
  //     name: addGroupDto.name,
  //     description: addGroupDto.description,
  //     position: addGroupDto.position,
  //     form: { id: addGroupDto.form_id } as Form,
  //   });
  //   await queryRunner.manager.save(createdGroup, { reload: true });
  //
  //   await Promise.all(
  //     addGroupDto.fields.map(async (field) => {
  //       await this.createField(field, createdGroup.id, queryRunner);
  //     }),
  //   );
  //
  //   return createdGroup;
  // }
  //
  // async createField(
  //   createFormFieldDto: CreateFormFieldDto,
  //   groupID: number,
  //   queryRunner: QueryRunner,
  // ) {
  //   const field = this.formFieldRepository.create({
  //     name: createFormFieldDto.name,
  //     label: createFormFieldDto.label,
  //     position: createFormFieldDto.position,
  //     required: createFormFieldDto.required,
  //     fieldType: { id: createFormFieldDto.type_id } as FieldType,
  //     group: { id: groupID } as FormGroup,
  //   });
  //
  //   await queryRunner.manager.save(field, { reload: true });
  //
  //   field.options = await Promise.all(
  //     createFormFieldDto.options.map(async (op) => {
  //       const option = this.fieldOptionRepository.create({
  //         name: op.name,
  //         formField: field,
  //       });
  //
  //       await queryRunner.manager.save(option);
  //
  //       return new FieldOption({ id: option.id, name: option.name });
  //     }),
  //   );
  //
  //   // TODO, apply validation on this
  //   if (fieldTypesWithValidationRules.includes(+createFormFieldDto.type_id)) {
  //     field.validationRules = await Promise.all(
  //       createFormFieldDto.validation_rules.map(async (vr) => {
  //         const rule = this.validationRuleRepository.create({
  //           rule: vr.rule,
  //           value: vr.value,
  //           formField: field,
  //         });
  //
  //         await queryRunner.manager.save(rule, { reload: true });
  //
  //         return new ValidationRule(rule);
  //       }),
  //     );
  //   }
  //
  //   return field;
  // }

  // async deleteField(id: number) {
  //   return await this.formFieldRepository.softDelete({ id });
  // }
  //
  // async deleteGroup(id: number) {
  //   return await this.formGroupRepository.softDelete({ id });
  // }

  async getFieldsTypes() {
    return await this.fieldTypeRepository.find({
      relations: {
        fieldTypeOperators: { query_operator: true },
      },
    });
  }
}
