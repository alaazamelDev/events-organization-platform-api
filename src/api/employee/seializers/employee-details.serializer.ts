import { FileUtilityService } from '../../../config/files/utility/file-utility.service';
import { Employee } from '../entities/employee.entity';
import * as moment from 'moment';
import { DEFAULT_DB_DATE_FORMAT } from '../../../common/constants/constants';
import { OrganizationSerializer } from '../../organization/serializers/organization.serializer';

export class EmployeeDetailsSerializer {
  static serialize(
    fileUtilityService: FileUtilityService,
    employee?: Employee,
  ) {
    if (!employee) return null;
    return {
      employee_id: employee.id,
      first_name: employee.first_name,
      last_name: employee.last_name,
      phone_number: employee.phone_number,
      profile_picture:
        employee.profile_picture != null
          ? fileUtilityService.getFileUrl(employee.profile_picture)
          : null,
      birth_date: moment(employee.birth_date).format(DEFAULT_DB_DATE_FORMAT),
      organization: OrganizationSerializer.serialize(employee.organization),
    };
  }
}
