import { Controller } from '@nestjs/common';
import { DynamicFormsService } from './dynamic-forms.service';

@Controller('dynamic-forms')
export class DynamicFormsController {
  constructor(private readonly dynamicFormsService: DynamicFormsService) {}
}
