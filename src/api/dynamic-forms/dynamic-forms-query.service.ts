import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { FilledFormField } from './entities/filled-form-field.entity';

@Injectable()
export class DynamicFormsQueryService {
  constructor(private readonly dataSource: DataSource) {}

  payload = {
    event_id: 1,
    groups: [
      {
        conditions: [
          // {
          //   field_id: 15,
          //   value: '101',
          //   operator: '>=',
          // },
          {
            field_id: 13,
            value: '%hello1%',
            operator: 'not like',
          },
        ],
      },
      {
        conditions: [
          {
            field_id: 13,
            value: 'hadi',
            operator: '=',
          },
          // {
          //   field_id: 15,
          //   value: '30',
          //   operator: '<',
          // },
        ],
      },
    ],
  };

  async queryFilledForms() {
    const query = this.dataSource
      .getRepository(FilledFormField)
      .createQueryBuilder('f')
      .select('DISTINCT(f.filled_form_id)');

    const conditions: string[] = [];

    this.payload.groups.forEach((group) => {
      const groupConditions: string[] = [];

      group.conditions.forEach((condition) => {
        groupConditions.push(
          `(f.filled_form_id IN ${this.createSubQuery(condition)})`,
        );
      });
      conditions.push(`(${groupConditions.join(' AND ')})`);
    });

    if (conditions.length) {
      query.where(`(${conditions.join(' OR ')})`);
    }

    const result = await query.getRawMany();
    console.log(result);
  }

  private createSubQuery(condition: any) {
    // if (!isNaN(+condition.value)) {
    //   return `(SELECT f1.filled_form_id
    //       FROM filled_form_fields f1
    //       WHERE f1.form_field_id = ${condition.field_id}
    //       AND CAST(f1.value AS int) ${condition.operator} '${condition.value}')`;
    // }
    return `(SELECT f1.filled_form_id 
          FROM filled_form_fields f1 
          WHERE f1.form_field_id = ${condition.field_id} 
          AND ${
            !isNaN(+condition.value) ? 'CAST(f1.value AS int)' : 'f1.value'
          } ${condition.operator} '${condition.value}')`;
  }
}
