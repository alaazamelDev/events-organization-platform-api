import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
  UseInterceptors,
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
import { DynamicFormsFillService } from './services/dynamic-forms-fill.service';
import { DynamicFormsFieldsService } from './services/dynamic-forms-fields.service';
import { DynamicFormsGroupsService } from './services/dynamic-forms-groups.service';
import { AddOptionDto } from './dto/update-form/add-option.dto';
import { UpdateOptionNameDto } from './dto/update-form/update-option-name.dto';
import { AccessTokenGuard } from '../../auth/guards/access-token.guard';
import { Request } from 'express';
import { ValidationRuleAlreadyExistInterceptor } from './interceptors/validation-rule-already-exist.interceptor';
import { ValidationRuleDoesNotExistInterceptor } from './interceptors/validation-rule-does-not-exist.interceptor';
import { TransactionInterceptor } from '../../common/interceptors/transaction/transaction.interceptor';
import { QueryRunnerParam } from '../../common/decorators/query-runner-param.decorator';
import { QueryRunner } from 'typeorm';

@Controller('forms')
export class DynamicFormsController {
  constructor(
    private readonly dynamicFormsService: DynamicFormsService,
    private readonly dynamicFormsQueryService: DynamicFormsQueryService,
    private readonly dynamicFormsValidationRulesService: DynamicFormsValidationRulesService,
    private readonly dynamicFormsFillService: DynamicFormsFillService,
    private readonly dynamicFormsFieldsService: DynamicFormsFieldsService,
    private readonly dynamicFormsGroupsService: DynamicFormsGroupsService,
  ) {}

  @Post('group/:id')
  updateFormGroup(
    @Param('id') id: string,
    @Body() updateFormGroupDto: UpdateFormGroupDto,
  ) {
    return this.dynamicFormsGroupsService.updateFormGroup(
      +id,
      updateFormGroupDto,
    );
  }

  @Get('fieldsTypes')
  getFieldsTypes() {
    return this.dynamicFormsFieldsService.getFieldsTypes();
  }

  @Get(':formID/events')
  getFormEvents(@Param('formID') formID: string) {
    return this.dynamicFormsService.getFormEvents(+formID);
  }

  @Post('query')
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

  @Post('field')
  updateFormField(@Body() updateFormFieldDto: UpdateFormFieldDto) {
    return this.dynamicFormsFieldsService.updateFormField(
      updateFormFieldDto.field_id,
      updateFormFieldDto,
    );
  }

  @Post('addField/:id')
  addField(
    @Param('id') id: string,
    @Body() createFormFieldDto: CreateFormFieldDto,
  ) {
    return this.dynamicFormsFieldsService.addField(+id, createFormFieldDto);
  }

  @Post('addGroup')
  addGroup(@Body() addGroupDto: AddGroupDto) {
    return this.dynamicFormsGroupsService.addGroup(addGroupDto);
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
    return this.dynamicFormsFieldsService.deleteField(+id);
  }

  @Delete('deleteGroup/:id')
  @UseInterceptors(TransactionInterceptor)
  deleteGroup(
    @Param('id') id: string,
    @QueryRunnerParam() queryRunner: QueryRunner,
  ) {
    return this.dynamicFormsGroupsService.deleteGroup(+id, queryRunner);
  }

  @Post('fillForm')
  @UseGuards(AccessTokenGuard)
  fillForm(@Body() fillFormDto: FillFormDto, @Req() req: Request) {
    const user: any = req.user;
    return this.dynamicFormsFillService.fillForm(fillFormDto, +user['sub']);
  }

  @Get('attendee/filledForm')
  getAttendeeFilledForm(@Body() getFilledFormDto: GetFilledFormDto) {
    return this.dynamicFormsFillService.getAttendeeFilledForm(getFilledFormDto);
  }

  @Get('event/:id')
  getEventFilledForms(@Param('id') id: string) {
    return this.dynamicFormsFillService.getEventFilledForms(+id);
  }

  @Post('validationRule')
  @UseInterceptors(ValidationRuleAlreadyExistInterceptor)
  addValidationRule(@Body() validationRuleDto: AddValidationRuleDto) {
    return this.dynamicFormsValidationRulesService.addValidationRule(
      validationRuleDto,
    );
  }

  @Post('addOption')
  addOptionToField(@Body() addOptionDto: AddOptionDto) {
    return this.dynamicFormsFieldsService.addOptionToField(addOptionDto);
  }

  @Delete('field/option/:id')
  deleteFieldOption(@Param('id') id: string) {
    return this.dynamicFormsFieldsService.deleteFieldOption(+id);
  }

  @Delete('validationRule/:id')
  @UseInterceptors(ValidationRuleDoesNotExistInterceptor)
  deleteValidationRule(@Param('id') id: string) {
    return this.dynamicFormsValidationRulesService.removeValidationRule(+id);
  }

  @Put('field/option')
  updateFieldOptionName(@Body() updateOptionNameDto: UpdateOptionNameDto) {
    return this.dynamicFormsFieldsService.updateFieldOptionName(
      updateOptionNameDto,
    );
  }
}
