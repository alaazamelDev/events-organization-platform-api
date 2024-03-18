import { PartialType } from '@nestjs/swagger';
import { ConfigureOrganizationsDto } from "./configure-organizations.dto";

export class UpdateOrganizationDto extends PartialType(ConfigureOrganizationsDto) {}
