import { Injectable } from '@nestjs/common';
import { AddValidationRuleDto } from '../dto/update-form/add-validation-rule.dto';
import { FormField } from '../entities/form-field.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ValidationRule } from '../entities/validation-rule.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DynamicFormsValidationRulesService {
  constructor(
    @InjectRepository(ValidationRule)
    private readonly validationRuleRepository: Repository<ValidationRule>,
  ) {}

  async addValidationRule(validationRuleDto: AddValidationRuleDto) {
    const rule = this.validationRuleRepository.create({
      rule: validationRuleDto.rule,
      value: validationRuleDto.value,
      formField: { id: validationRuleDto.field_id } as FormField,
    });

    await this.validationRuleRepository.save(rule);

    return rule;
  }

  async removeValidationRule(id: number) {
    return await this.validationRuleRepository.softDelete(id);
  }
}
