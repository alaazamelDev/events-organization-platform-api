import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Form } from './entities/form.entity';
import { FormField } from './entities/ form-field.entity';
import { FieldOption } from './entities/field-option.entity';
import { FieldType } from './entities/field-type.entity';
import { CreateFormDto } from './dto/create-form.dto';
import { date } from 'joi';
import { Organization } from '../organization/entities/organization.entity';

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
    @InjectRepository(FieldType)
    private readonly fieldTypeRepository: Repository<FieldType>,
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
        createFormDto.fields.map(async (field) => {
          const createdField = this.formFieldRepository.create({
            name: field.name,
            label: field.label,
            fieldType: { id: field.type_id } as FieldType,
            position: field.position,
            required: field.required,
            form: form,
          });

          await queryRunner.manager.save(createdField, { reload: true });

          if (field.options) {
            await Promise.all(
              field.options.map(async (op) => {
                const option = this.fieldOptionRepository.create({
                  name: op.name,
                  formField: createdField,
                });

                await queryRunner.manager.save(option, { reload: true });
              }),
            );
          }
        }),
      );

      await queryRunner.commitTransaction();
      await queryRunner.release();

      return form;
    } catch (e) {
      console.log(e);
      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      throw e;
    }
  }
}
