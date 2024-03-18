import { IsNotEmpty, IsString } from "class-validator";
import { AddContactInfoDto } from "./add-contact-info.dto";

type CONTACTINFO = {
  id: number;
  content: string;
}
export class ConfigureOrganizationsDto {
  @IsNotEmpty()
  org_id: number;

  @IsString()
  bio: string;

  @IsString()
  description: string;

  @IsNotEmpty()
  contact_info: [AddContactInfoDto];
}