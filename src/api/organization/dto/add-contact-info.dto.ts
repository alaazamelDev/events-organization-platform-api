import { IsNotEmpty } from "class-validator";

export class AddContactInfoDto {
  @IsNotEmpty()
  contact_id: number;

  @IsNotEmpty()
  content: string;
}