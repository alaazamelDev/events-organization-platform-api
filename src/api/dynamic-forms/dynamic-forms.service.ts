import { Injectable } from '@nestjs/common';
import { Brackets, DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Form } from './entities/form.entity';
import { FormField } from './entities/ form-field.entity';
import { FieldOption } from './entities/field-option.entity';
import { FieldType } from './entities/field-type.entity';
import { CreateFormDto } from './dto/create-form.dto';
import { Organization } from '../organization/entities/organization.entity';
import { UpdateFormDto } from './dto/update-form.dto';
import { UpdateFormFieldDto } from './dto/update-form-field.dto';
import { CreateFormFieldDto } from './dto/create-form-field.dto';
import { FillFormDto } from './dto/fill-form.dto';
import { FilledForm } from './entities/filled-form.entity';
import { Attendee } from '../attendee/entities/attendee.entity';
import { Event } from './entities/event.entity';
import { FilledFormField } from './entities/filled-form-field.entity';
import { GetFilledFormDto } from './dto/get-filled-form.dto';

// TODO, replace the fake Event entity with the real one
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
    @InjectRepository(FilledForm)
    private readonly filledFormRepository: Repository<FilledForm>,
    @InjectRepository(FilledFormField)
    private readonly filledFormFieldRepository: Repository<FilledFormField>,
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

  async updateForm(id: number, updateFormDto: UpdateFormDto) {
    const form = await this.formRepository.findOneOrFail({
      where: { id: id },
    });

    Object.assign(form, updateFormDto);

    await this.formRepository.save(form, { reload: true });

    return form;
  }

  async getOrganizationForms(id: number) {
    return await this.formRepository.find({
      where: { organization: { id: id } },
    });
  }

  async getForm(id: number) {
    return await this.formRepository.findOneOrFail({
      where: { id: id },
      relations: {
        fields: { options: true, fieldType: true },
      },
    });
  }

  async deleteForm(id: number) {
    return await this.formRepository.softDelete({ id });
  }

  async updateFormField(id: number, updateFormFieldDto: UpdateFormFieldDto) {
    const field = await this.formFieldRepository.findOneOrFail({
      where: { id: id },
    });

    Object.assign(field, updateFormFieldDto);

    await this.formFieldRepository.save(field, { reload: true });

    return field;
  }

  async addField(id: number, createFormFieldDto: CreateFormFieldDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const field = this.formFieldRepository.create({
        name: createFormFieldDto.name,
        label: createFormFieldDto.label,
        position: createFormFieldDto.position,
        required: createFormFieldDto.required,
        fieldType: { id: createFormFieldDto.type_id } as FieldType,
        form: { id: id } as Form,
      });

      await queryRunner.manager.save(field, { reload: true });

      if (createFormFieldDto.options) {
        const options = await Promise.all(
          createFormFieldDto.options.map(async (op) => {
            const option = this.fieldOptionRepository.create({
              name: op.name,
              formField: field,
            });

            await queryRunner.manager.save(option);

            return new FieldOption({ id: option.id, name: option.name });
          }),
        );

        field.options = options;
      }

      await queryRunner.commitTransaction();
      await queryRunner.release();

      return field;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      throw e;
    }
  }

  async deleteField(id: number) {
    return await this.formFieldRepository.softDelete({ id });
  }

  async fillForm(fillFormDto: FillFormDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    await queryRunner.startTransaction();
    try {
      const filledForm = this.filledFormRepository.create({
        attendee: { id: fillFormDto.attendee_id } as Attendee,
        form: { id: fillFormDto.form_id } as Form,
        event: { id: fillFormDto.event_id } as Event,
      });

      await queryRunner.manager.save(filledForm, { reload: true });

      await Promise.all(
        fillFormDto.fields.map(async (field) => {
          const optionValue = await this.getOptionValue(field.option_id);
          const filledField = this.filledFormFieldRepository.create({
            value: optionValue ? optionValue : field.value,
            formField: { id: field.field_id } as FormField,
            filledForm: filledForm,
            option: field.option_id ? { id: field.option_id } : null,
          });

          await queryRunner.manager.save(filledField);
        }),
      );

      // await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      throw e;
    }
  }

  async getAttendeeFilledForm(getFilledFormDto: GetFilledFormDto) {
    return await this.filledFormRepository.findOneOrFail({
      where: {
        attendee: { id: getFilledFormDto.attendee_id } as Attendee,
        event: { id: getFilledFormDto.event_id } as Event,
      },
      relations: {
        filledFormFields: { formField: { options: true }, option: true },
      },
    });
  }

  async getEventFilledForms(id: number) {
    return await this.filledFormRepository.find({
      where: { event: { id: id } as Event },
      relations: { filledFormFields: { formField: { fieldType: true } } },
    });
  }

  // payload = {
  //   event_id: 1,
  //   groups: [
  //     {
  //       conditions: [
  //         {
  //           field_id: 15,
  //           value: '10',
  //           operator: '>=',
  //         },
  //         {
  //           field_id: 13,
  //           value: '16',
  //           operator: '>=',
  //         },
  //       ],
  //     },
  //     {
  //       conditions: [
  //         {
  //           field_id: 13,
  //           value: '155',
  //           operator: '>=',
  //         },
  //       ],
  //     },
  //   ],
  // };

  // async queryForms() {
  //   let query = this.dataSource
  //     .getRepository(FilledFormField)
  //     .createQueryBuilder('f')
  //     .select('DISTINCT(f.filled_form_id)');
  //
  //   let whereClause = '';
  //   this.payload.groups.forEach((group, index) => {
  //     let groupConditions = '';
  //
  //     group.conditions.forEach((condition, conIndex) => {
  //       if (conIndex !== 0) {
  //         groupConditions += 'AND';
  //       }
  //
  //       groupConditions += `(f.filled_form_id IN
  //         (SELECT f1.filled_form_id
  //         FROM filled_form_fields f1
  //         WHERE f1.form_field_id = ${condition.field_id}
  //         AND f1.value ${condition.operator} '${condition.value}'))`;
  //     });
  //
  //     if (index !== 0) {
  //       whereClause += 'OR';
  //     }
  //     whereClause += `(${groupConditions})`;
  //   });
  //
  //   if (whereClause !== '') {
  //     query = query.where(whereClause);
  //   }
  //
  //   const result = await query.getRawMany();
  //   console.log(result);
  // }

  private async getOptionValue(id: number) {
    if (id === undefined) return null;
    const option = await this.fieldOptionRepository.findOneOrFail({
      where: { id: id },
    });

    if (option) return option.name;
    else return null;
  }
}
