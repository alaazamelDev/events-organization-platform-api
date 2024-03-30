import { PartialType } from '@nestjs/swagger';
import { CreateFormGroupDto } from '../create-form/create-form-group.dto';

export class UpdateFormGroupDto extends PartialType(CreateFormGroupDto) {}
