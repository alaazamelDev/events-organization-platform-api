import { BlockedOrganization } from '../entities/blocked-organization.entity';
import { OrganizationSerializer } from '../../organization/serializers/organization.serializer';
import { DEFAULT_DB_DATE_FORMAT } from '../../../common/constants/constants';
import * as moment from 'moment';

export class BlockedOrganizationSerializer {
  static serialize(data?: BlockedOrganization) {
    if (!data) return null;
    return {
      organization: OrganizationSerializer.serialize(data.organization),
      blocked_at: moment(data.createdAt).format(DEFAULT_DB_DATE_FORMAT),
    };
  }

  static serializeList(data?: BlockedOrganization[]) {
    if (!data) return undefined;
    return data.map((item) => this.serialize(item));
  }
}
