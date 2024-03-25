import { Module } from '@nestjs/common';
import { DynamicFormsService } from './dynamic-forms.service';
import { DynamicFormsController } from './dynamic-forms.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
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
import { DynamicFormsQueryService } from './dynamic-forms-query.service';
import { QueryOperator } from './entities/query-operator';
import { FieldTypeOperators } from './entities/field-type.operators';
import { IsQueryOperatorSuitsTheFieldConstraint } from './validators/is_query_operator_suits_the_field_constraint';

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
      FieldTypeOperators,
    ]),
  ],
  controllers: [DynamicFormsController],
  providers: [
    DynamicFormsService,
    DynamicFormsQueryService,
    IsFieldBelongsToForm,
    IsFieldOptionRequiredConstraint,
    IsOptionBelongsToTheFieldConstraint,
    AreRequiredFieldsProvidedConstraint,
    IsFieldValueCorrectConstraint,
    IsQueryOperatorSuitsTheFieldConstraint,
  ],
})
export class DynamicFormsModule {}
