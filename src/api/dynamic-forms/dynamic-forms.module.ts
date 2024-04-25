import { Module } from '@nestjs/common';
import { DynamicFormsService } from './services/dynamic-forms.service';
import { DynamicFormsController } from './dynamic-forms.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from '../event/entities/event.entity';
import { Form } from './entities/form.entity';
import { FormField } from './entities/form-field.entity';
import { FieldType } from './entities/field-type.entity';
import { FieldOption } from './entities/field-option.entity';
import { FilledForm } from './entities/filled-form.entity';
import { FilledFormField } from './entities/filled-form-field.entity';
import { IsFieldBelongsToForm } from './validators/is_field_belongs_to_form_constraint';
import { IsFieldOptionRequiredConstraint } from './validators/is_field_option_required_constraint';
import { IsOptionBelongsToTheFieldConstraint } from './validators/is_option_belongs_to_the_field_constraint';
import { AreRequiredFieldsProvidedConstraint } from './validators/are_required_fields_provided_constraint';
import { IsFieldValueCorrectConstraint } from './validators/is_field_value_correct_constraint';
import { DynamicFormsQueryService } from './services/dynamic-forms-query.service';
import { QueryOperator } from './entities/query-operator';
import { FieldTypeOperatorsEntity } from './entities/field-type-operators.entity';
import { IsQueryOperatorSuitsTheFieldConstraint } from './validators/is_query_operator_suits_the_field_constraint';
import { FormGroup } from './entities/form-group.entity';
import { ValidationRule } from './entities/validation-rule.entity';
import { IsValidationRuleValueSuitsTheFieldConstraint } from './validators/is_validation_rule_value_suits_the_field_constraint';
import { IsFieldValueMeetsValidationRulesConstraint } from './validators/is_field_value_meets_validation_rules_constraint';
import { IsFieldTypeSupportValidationRulesConstraint } from './validators/is_field_type_support_validation_rules_constraint';
import { DynamicFormsValidationRulesService } from './services/dynamic-forms-validation-rules.service';
import { DynamicFormsFillService } from './services/dynamic-forms-fill.service';
import { DynamicFormsFieldsService } from './services/dynamic-forms-fields.service';
import { DynamicFormsGroupsService } from './services/dynamic-forms-groups.service';
import { IsGroupBelongsToTheFieldFormConstraint } from './validators/is_group_belongs_to_the_field_form_constraint';
import { IsFieldTypeSupportOptionsConstraint } from './validators/is_field_type_support_options_constraint';
import { IsOptionNameUniqueConstraint } from './validators/is_option_name_unique_constraint.dto';
import { Attendee } from '../attendee/entities/attendee.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Event,
      Form,
      FormField,
      FieldType,
      FieldOption,
      FilledForm,
      FilledFormField,
      QueryOperator,
      FieldTypeOperatorsEntity,
      FormGroup,
      ValidationRule,
      Attendee,
      Event,
    ]),
  ],
  controllers: [DynamicFormsController],
  providers: [
    DynamicFormsService,
    DynamicFormsQueryService,
    DynamicFormsValidationRulesService,
    DynamicFormsFillService,
    DynamicFormsFieldsService,
    DynamicFormsGroupsService,
    IsFieldBelongsToForm,
    IsFieldOptionRequiredConstraint,
    IsOptionBelongsToTheFieldConstraint,
    AreRequiredFieldsProvidedConstraint,
    IsFieldValueCorrectConstraint,
    IsQueryOperatorSuitsTheFieldConstraint,
    IsValidationRuleValueSuitsTheFieldConstraint,
    IsFieldValueMeetsValidationRulesConstraint,
    IsFieldTypeSupportValidationRulesConstraint,
    IsGroupBelongsToTheFieldFormConstraint,
    IsFieldTypeSupportOptionsConstraint,
    IsOptionNameUniqueConstraint,
  ],
})
export class DynamicFormsModule {}
