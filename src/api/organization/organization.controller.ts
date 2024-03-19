import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { ConfigureOrganizationsDto } from './dto/configure-organizations.dto';
import { DeleteContactInfoDto } from './dto/delete-contact-info.dto';
import { AddContactInfoDto } from './dto/add-contact-info.dto';
import { AddOrganizationAddressDto } from './dto/add-organization-address.dto';
import { DeleteOrganizationAddressDto } from './dto/delete-organization-address.dto';

@Controller('organization')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post()
  create(@Body() createOrganizationDto: CreateOrganizationDto) {
    return this.organizationService.create(createOrganizationDto);
  }

  @Post('configure')
  configureOrganization(
    @Body() configureOrganization: ConfigureOrganizationsDto,
  ) {
    return this.organizationService.configureOrganization(
      configureOrganization,
    );
  }

  @Get()
  findAll() {
    return this.organizationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.organizationService.findOne(+id);
  }

  @Get('employees/:id')
  getOrganizationEmployees(@Param('id') id: number) {
    return this.organizationService.getOrganizationEmployees(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ) {
    return this.organizationService.update(+id, updateOrganizationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.organizationService.remove(+id);
  }

  @Delete('contact/:id')
  deleteContactInfo(
    @Param('id') id: string,
    @Body() deleteContactInfoDto: DeleteContactInfoDto,
  ) {
    return this.organizationService.deleteContactInfo(
      +id,
      deleteContactInfoDto,
    );
  }

  @Post('contact/:id')
  addContactInfo(
    @Param('id') id: string,
    @Body() addContactInfoDto: AddContactInfoDto,
  ) {
    return this.organizationService.addContactInfo(+id, addContactInfoDto);
  }

  @Post('address/:id')
  addOrganizationAddress(
    @Param('id') id: string,
    @Body() addOrganizationAddressDto: AddOrganizationAddressDto,
  ) {
    return this.organizationService.addOrganizationAddress(
      +id,
      addOrganizationAddressDto,
    );
  }

  @Delete('address/:id')
  deleteOrganizationAddress(
    @Param('id') id: string,
    @Body() deleteOrganizationAddressDto: DeleteOrganizationAddressDto,
  ) {
    return this.organizationService.deleteOrganizationAddress(
      +id,
      deleteOrganizationAddressDto,
    );
  }
}
