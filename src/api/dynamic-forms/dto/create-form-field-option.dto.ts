import { IsString } from 'class-validator';

export class CreateFormFieldOptionDto {
  @IsString()
  name: string;
}
