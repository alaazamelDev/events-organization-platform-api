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

@Controller('forms')
export class DynamicFormsController {
  constructor(
    private readonly dynamicFormsService: DynamicFormsService,
    private readonly dynamicFormsQueryService: DynamicFormsQueryService,
  ) {}

  @Get('test')
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

  @Post('addField/:id')
  addField(
    @Param('id') id: string,
    @Body() createFormFieldDto: CreateFormFieldDto,
  ) {
    return this.dynamicFormsService.addField(+id, createFormFieldDto);
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
}
