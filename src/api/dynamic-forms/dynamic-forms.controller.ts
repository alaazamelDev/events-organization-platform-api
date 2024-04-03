import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { DynamicFormsService } from './services/dynamic-forms.service';
import { CreateFormDto } from './dto/create-form/create-form.dto';
import { UpdateFormDto } from './dto/update-form/update-form.dto';
import { UpdateFormFieldDto } from './dto/update-form/update-form-field.dto';
import { CreateFormFieldDto } from './dto/create-form/create-form-field.dto';
import { FillFormDto } from './dto/fill-form/fill-form.dto';
import { GetFilledFormDto } from './dto/get-filled-form.dto';
import { DynamicFormsQueryService } from './services/dynamic-forms-query.service';
import { QueryFormDto } from './dto/query-form/query-form.dto';
import { UpdateFormGroupDto } from './dto/update-form/update-form-group.dto';
import { AddValidationRuleDto } from './dto/update-form/add-validation-rule.dto';
import { DynamicFormsValidationRulesService } from './services/dynamic-forms-validation-rules.service';
import { AddGroupDto } from './dto/update-form/add-group.dto';

@Controller('forms')
export class DynamicFormsController {
  constructor(
    private readonly dynamicFormsService: DynamicFormsService,
    private readonly dynamicFormsQueryService: DynamicFormsQueryService,
    private readonly dynamicFormsValidationRulesService: DynamicFormsValidationRulesService,
  ) {}

  @Get('fieldsTypes')
  getFieldsTypes() {
    return this.dynamicFormsService.getFieldsTypes();
  }

  @Get('query')
  queryForms(@Body() queryFormDto: QueryFormDto) {
    return this.dynamicFormsQueryService.queryFilledForms(queryFormDto);
  }

  @Post()
  createForm(@Body() createFormDto: CreateFormDto) {
    return this.dynamicFormsService.createForm(createFormDto);
  }

  //TODO, take the org_id from the employee token whose making the request
  @Get('organization/:id')
  getOrganizationForms(@Param('id') id: string) {
    return this.dynamicFormsService.getOrganizationForms(+id);
  }

  @Get(':id')
  getForm(@Param('id') id: string) {
    return this.dynamicFormsService.getForm(+id);
  }

  @Patch('field/:id')
  updateFormField(
    @Param('id') id: string,
    @Body() updateFormFieldDto: UpdateFormFieldDto,
  ) {
    return this.dynamicFormsService.updateFormField(+id, updateFormFieldDto);
  }

  @Patch('group/:id')
  updateFormGroup(
    @Param('id') id: string,
    @Body() updateFormGroupDto: UpdateFormGroupDto,
  ) {
    return this.dynamicFormsService.updateFormGroup(+id, updateFormGroupDto);
  }

  @Post('addField/:id')
  addField(
    @Param('id') id: string,
    @Body() createFormFieldDto: CreateFormFieldDto,
  ) {
    return this.dynamicFormsService.addField(+id, createFormFieldDto);
  }

  @Post('addGroup')
  addGroup(@Body() addGroupDto: AddGroupDto) {
    return this.dynamicFormsService.addGroup(addGroupDto);
  }

  @Patch(':id')
  updateForm(@Param('id') id: string, @Body() updateFormDto: UpdateFormDto) {
    return this.dynamicFormsService.updateForm(+id, updateFormDto);
  }

  @Delete(':id')
  deleteForm(@Param('id') id: string) {
    return this.dynamicFormsService.deleteForm(+id);
  }

  @Delete('deleteField/:id')
  deleteField(@Param('id') id: string) {
    return this.dynamicFormsService.deleteField(+id);
  }

  @Delete('deleteGroup/:id')
  deleteGroup(@Param('id') id: string) {
    return this.dynamicFormsService.deleteGroup(+id);
  }

  @Post('fillForm')
  fillForm(@Body() fillFormDto: FillFormDto) {
    return this.dynamicFormsService.fillForm(fillFormDto);
  }

  @Get('attendee/filledForm')
  getAttendeeFilledForm(@Body() getFilledFormDto: GetFilledFormDto) {
    return this.dynamicFormsService.getAttendeeFilledForm(getFilledFormDto);
  }

  @Get('event/:id')
  getEventFilledForms(@Param('id') id: string) {
    return this.dynamicFormsService.getEventFilledForms(+id);
  }

  @Post('validationRule')
  addValidationRule(@Body() validationRuleDto: AddValidationRuleDto) {
    return this.dynamicFormsValidationRulesService.addValidationRule(
      validationRuleDto,
    );
  }

  @Delete('validationRule/:id')
  deleteValidationRule(@Param('id') id: string) {
    return this.dynamicFormsValidationRulesService.removeValidationRule(+id);
  }
}
