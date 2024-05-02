import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { FilledFormField } from '../entities/filled-form-field.entity';
import { QueryFormDto } from '../dto/query-form/query-form.dto';
import { QueryFormConditionDto } from '../dto/query-form/query-form-condition.dto';
import { QueryOperator } from '../entities/query-operator';
import { FilledForm } from '../entities/filled-form.entity';
import { AttendeeEvent } from '../../attend-event/entities/attendee-event.entity';

@Injectable()
export class DynamicFormsQueryService {
  constructor(private readonly dataSource: DataSource) {}

  async queryFilledForms(queryFormDto: QueryFormDto) {
    const query = this.dataSource
      .getRepository(FilledFormField)
      .createQueryBuilder('f')
      .select('DISTINCT(f.filled_form_id)');

    const conditions: string[] = [];

    for (const group of queryFormDto.groups) {
      const groupConditions: string[] = [];

      await Promise.all(
        group.conditions.map(async (condition) => {
          const subQuery = await this.createSubQuery(condition);
          groupConditions.push(`(f.filled_form_id IN ${subQuery})`);
        }),
      );

      conditions.push(`(${groupConditions.join(' AND ')})`);
    }

    if (conditions.length) {
      query.where(`(${conditions.join(' OR ')})`);
    }

    const result = await query.getRawMany();

    const results = await Promise.all(
      result.map(async (res) => {
        const filledForm = await this.dataSource
          .getRepository(FilledForm)
          .createQueryBuilder('filled')
          .where('filled.id = :filledID', { filledID: res.filled_form_id })
          .andWhere('filled.event = :eventID', {
            eventID: queryFormDto.event_id,
          })
          .leftJoinAndSelect('filled.attendee', 'attendee')
          .leftJoin('attendee.user', 'user')
          .addSelect(['user.id', 'user.email', 'user.username'])
          .leftJoin('filled.filledFormFields', 'field')
          .addSelect(['field.id', 'field.value', 'field.option'])
          .leftJoin('field.formField', 'form_field')
          .addSelect(['form_field.id'])
          .leftJoin('field.option', 'option')
          .addSelect(['option.id'])
          .leftJoinAndSelect('filled.event', 'event')
          .leftJoinAndSelect(
            'event.attendees',
            'attendees',
            'attendees.attendee = filled.attendee AND attendees.event = filled.event',
          )
          .getOne();

        if (filledForm) {
          const registerStatus = await this.dataSource
            .getRepository(AttendeeEvent)
            .createQueryBuilder('attendee_event')
            .where('attendee_event.attendee = :attendeeID', {
              attendeeID: filledForm.attendee.id,
            })
            .andWhere('attendee_event.event = :eventID', {
              eventID: filledForm.event.id,
            })
            .getOne();

          return {
            ...this.formatObject(filledForm),
            status: registerStatus ? registerStatus.status : 'not registered',
          };
        } else {
          return;
        }
      }),
    ).then((results) => results.filter((r) => r));

    return results;
  }

  private formatObject(filledForm: FilledForm) {
    return {
      id: filledForm.id,
      submission_date: filledForm.createdAt,
      attendee: {
        id: filledForm.attendee.id,
        firstName: filledForm.attendee.firstName,
        lastName: filledForm.attendee.lastName,
        phoneNumber: filledForm.attendee.phoneNumber,
        profilePictureUrl: filledForm.attendee.profilePictureUrl,
        birthDate: filledForm.attendee.birthDate,
        bio: filledForm.attendee.bio,
        coverPictureUrl: filledForm.attendee.coverPictureUrl,
        user: {
          username: filledForm.attendee.user.username,
          email: filledForm.attendee.user.email,
        },
      },
      fields: filledForm.filledFormFields.map((field) => {
        return {
          id: field.id,
          value: field.value,
          field_id: field.formField.id,
          option_id: field.option?.id ? field.option.id : null,
        };
      }),
    };
  }

  private async createSubQuery(condition: QueryFormConditionDto) {
    const operator = await this.getOperator(condition.operator_id);
    const value = this.getValue(condition);

    return `(SELECT f1.filled_form_id 
          FROM filled_form_fields f1 
          WHERE f1.form_field_id = ${condition.field_id} 
          AND ${
            !isNaN(+condition.value) ? 'CAST(f1.value AS int)' : 'f1.value'
          } ${operator} '${value}')`;
  }

  private async getOperator(operator_id: number) {
    return await this.dataSource
      .getRepository(QueryOperator)
      .createQueryBuilder()
      .where('id = :opID', { opID: operator_id })
      .getOneOrFail()
      .then((op) => op.value);
  }

  private getValue(condition: QueryFormConditionDto) {
    switch (condition.operator_id) {
      case 6:
        return `%${condition.value}%`;
      case 7:
        return `%${condition.value}%`;
      default:
        return condition.value;
    }
  }
}
