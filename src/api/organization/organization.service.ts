import { Injectable } from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';
import { DataSource, Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { UserRole } from '../userRole/entities/user_role.entity';
import { Employee } from '../employee/entities/employee.entity';
import { Permission } from '../permission/entities/permission.entity';
import { EmployeePermission } from '../employee/entities/employee_permission.entity';
import { Contact } from '../contact/entities/contact.entity';
import { ConfigureOrganizationsDto } from './dto/configure-organizations.dto';
import { ContactOrganization } from './entities/contact_organization.entity';
import { DeleteContactInfoDto } from './dto/delete-contact-info.dto';
import { AddContactInfoDto } from './dto/add-contact-info.dto';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
    @InjectRepository(ContactOrganization)
    private readonly contactOrganizationRepository: Repository<ContactOrganization>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createOrganizationDto: CreateOrganizationDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const organization = this.organizationRepository.create({
        name: createOrganizationDto.name,
      });

      await queryRunner.manager.save(organization);

      const user = this.userRepository.create({
        username: createOrganizationDto.username,
        email: createOrganizationDto.email,
        password: createOrganizationDto.password,
      });

      user.userRole = { id: 2 } as UserRole;

      await queryRunner.manager.save(user);

      const employee = this.employeeRepository.create({
        first_name: createOrganizationDto.first_name,
        last_name: createOrganizationDto.last_name,
        birth_date: createOrganizationDto.birth_date,
        phone_number: createOrganizationDto.phone_number,

        organization: organization,
        user: user,
      });

      await queryRunner.manager.save(employee);

      const permissions = await this.permissionRepository.find();

      const employeePermissions: EmployeePermission[] = permissions.map((p) => {
        const employeePermission = new EmployeePermission();
        employeePermission.employee = employee;
        employeePermission.permission = p;

        return employeePermission;
      });

      await queryRunner.manager.save(employeePermissions);

      await queryRunner.commitTransaction();

      return organization;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    }
  }

  async findAll() {
    return await this.organizationRepository.find();
  }

  async findOne(id: number) {
    return await this.organizationRepository.findOneOrFail({
      where: { id: id },
    });
  }

  async update(id: number, updateOrganizationDto: UpdateOrganizationDto) {
    const organization = await this.organizationRepository.findOneOrFail({
      where: { id: id },
    });

    Object.assign(organization, updateOrganizationDto);

    await this.organizationRepository.save(organization);

    return organization;
  }

  remove(id: number) {
    return `This action removes a #${id} organization`;
  }

  async configureOrganization(
    configureOrganizationDto: ConfigureOrganizationsDto,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const organization = await this.organizationRepository.findOneOrFail({
        where: { id: configureOrganizationDto.org_id },
      });

      organization.description = configureOrganizationDto.description;
      organization.bio = configureOrganizationDto.bio;

      const contacts = configureOrganizationDto.contact_info.map((c) => {
        const contactOrganization = new ContactOrganization();

        contactOrganization.organization = organization;
        contactOrganization.contact = { id: c.contact_id } as Contact;
        contactOrganization.content = c.content;

        return contactOrganization;
      });

      await queryRunner.manager.save(organization);
      await queryRunner.manager.save(contacts);
      await queryRunner.commitTransaction();
      await queryRunner.release();

      return organization;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw e;
    }
  }

  async configureOrganizationInitialization() {
    return await this.contactRepository.find();
  }

  async getOrganizationEmployees(id: number) {
    return await this.employeeRepository.find({
      where: { organization: { id: id } },
      relations: {
        permissions: { permission: true },
        user: true,
      },
    });
  }

  async deleteContactInfo(
    id: number,
    deleteContactInfoDto: DeleteContactInfoDto,
  ) {
    const contact = await this.contactOrganizationRepository.delete(
      deleteContactInfoDto.contact_id,
    );
    console.log(id);
    console.log(contact);
  }

  async addContactInfo(id: number, addContactInfoDto: AddContactInfoDto) {
    const organization = await this.organizationRepository.findOneOrFail({
      where: { id: id },
    });

    const contactOrganization = this.contactOrganizationRepository.create({
      content: addContactInfoDto.content,
      contact: { id: addContactInfoDto.contact_id } as Contact,
      organization: organization,
    });

    await this.contactOrganizationRepository.save(contactOrganization);

    return contactOrganization;
  }
}
