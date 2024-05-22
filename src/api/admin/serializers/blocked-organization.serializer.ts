import { BlockedOrganization } from '../entities/blocked-organization.entity';
import { OrganizationSerializer } from '../../organization/serializers/organization.serializer';
import { DEFAULT_DB_DATETIME_FORMAT } from '../../../common/constants/constants';
import * as moment from 'moment';
import { FileUtilityService } from '../../../config/files/utility/file-utility.service';

export class BlockedOrganizationSerializer {
  static serialize(
    data?: BlockedOrganization,
    fileUtilityService?: FileUtilityService,
  ) {
    if (!data) return null;
    return {
      organization: OrganizationSerializer.serialize(
        data.organization,
        fileUtilityService,
      ),
      blocked_at: moment(data.createdAt).format(DEFAULT_DB_DATETIME_FORMAT),
    };
  }

  static serializeList(
    data?: BlockedOrganization[],
    fileUtilityService?: FileUtilityService,
  ) {
    if (!data) return undefined;
    return data.map((item) => this.serialize(item, fileUtilityService));
  }
}
