import { IsNotEmpty } from "class-validator";

export class DeleteContactInfoDto {
  @IsNotEmpty()
  contact_id: number;
}