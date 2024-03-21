import { Module } from '@nestjs/common';
import { DynamicFormsService } from './dynamic-forms.service';
import { DynamicFormsController } from './dynamic-forms.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { Form } from './entities/form.entity';
import { FormField } from './entities/ form-field.entity';
import { FieldType } from './entities/field-type.entity';
import { Option } from './entities/option.entity';
import { FilledForm } from './entities/filled-form.entity';
import { FilledFormField } from './entities/filled-form-field.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Event,
      Form,
      FormField,
      FieldType,
      Option,
      FilledForm,
      FilledFormField,
    ]),
  ],
  controllers: [DynamicFormsController],
  providers: [DynamicFormsService],
})
export class DynamicFormsModule {}
