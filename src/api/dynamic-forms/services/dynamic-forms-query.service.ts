import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { FilledFormField } from '../entities/filled-form-field.entity';
import { QueryFormDto } from '../dto/query-form/query-form.dto';
import { QueryFormConditionDto } from '../dto/query-form/query-form-condition.dto';
import { QueryOperator } from '../entities/query-operator';
import { InjectRepository } from '@nestjs/typeorm';
import { FilledForm } from '../entities/filled-form.entity';

@Injectable()
export class DynamicFormsQueryService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(FilledForm)
    private readonly filledFormRepository: Repository<FilledForm>,
  ) {}

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

    const forms = await Promise.all(
      result.map((res) => {
        return this.filledFormRepository.find({
          where: {
            id: res.filled_form_id,
            event: { id: queryFormDto.event_id },
          },
          relations: {
            filledFormFields: { formField: { fieldType: true }, option: true },
            attendee: true,
          },
        });
      }),
    );

    console.log(forms);
    return forms;
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
