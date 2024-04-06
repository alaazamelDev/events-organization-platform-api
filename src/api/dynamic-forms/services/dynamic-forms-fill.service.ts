import { Injectable } from '@nestjs/common';
import { FillFormDto } from '../dto/fill-form/fill-form.dto';
import { Attendee } from '../../attendee/entities/attendee.entity';
import { Form } from '../entities/form.entity';
import { Event } from '../../event/entities/event.entity';
import { FormField } from '../entities/form-field.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FilledForm } from '../entities/filled-form.entity';
import { FilledFormField } from '../entities/filled-form-field.entity';
import { FieldOption } from '../entities/field-option.entity';
import { GetFilledFormDto } from '../dto/get-filled-form.dto';

@Injectable()
export class DynamicFormsFillService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(FilledForm)
    private readonly filledFormRepository: Repository<FilledForm>,
    @InjectRepository(FilledFormField)
    private readonly filledFormFieldRepository: Repository<FilledFormField>,
    @InjectRepository(FieldOption)
    private readonly fieldOptionRepository: Repository<FieldOption>,
  ) {}

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

      await queryRunner.commitTransaction();

      return filledForm;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      throw e;
    }
  }

  async getAttendeeFilledForm(getFilledFormDto: GetFilledFormDto) {
    const filledForm = await this.filledFormRepository.findOneOrFail({
      where: {
        attendee: { id: getFilledFormDto.attendee_id } as Attendee,
        event: { id: getFilledFormDto.event_id } as Event,
      },
      relations: {
        form: true,
      },
    });

    return await this.dataSource
      .getRepository(Form)
      .createQueryBuilder('form')
      .where('form.id = :formID', { formID: filledForm.form.id })
      .leftJoinAndSelect('form.groups', 'group')
      .leftJoinAndSelect('group.fields', 'field')
      .leftJoinAndSelect('field.filledFormFields', 'filledFormField')
      .where('filledFormField.filled_form_id = :ffID', { ffID: filledForm.id })
      .getMany();
  }

  async getEventFilledForms(id: number) {
    return await this.filledFormRepository.find({
      where: { event: { id: id } as Event },
      relations: {
        form: true,
        attendee: true,
      },
    });
  }

  private async getOptionValue(id: number) {
    if (id === undefined) return null;
    const option = await this.fieldOptionRepository.findOneOrFail({
      where: { id: id },
    });

    if (option) return option.name;
    else return null;
  }
}
