import { Body, Controller, Get, Post } from '@nestjs/common';
import { DynamicFormsService } from './dynamic-forms.service';
import { CreateFormDto } from './dto/create-form.dto';

@Controller('forms')
export class DynamicFormsController {
  constructor(private readonly dynamicFormsService: DynamicFormsService) {}

  @Post()
  createForm(@Body() createFormDto: CreateFormDto) {
    return this.dynamicFormsService.createForm(createFormDto);
  }
}
