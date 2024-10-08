import { OrganizationReport } from '../entities/organization-report.entity';
import { UserSerializer } from '../../user/serializers/user.serializer';
import { FileUtilityService } from '../../../config/files/utility/file-utility.service';
import * as moment from 'moment';
import { DEFAULT_DB_DATETIME_FORMAT } from '../../../common/constants/constants';
import { OrganizationReportTypeEnum } from '../enums/organization-report-type.enum';
import { GroupMessageSerializer } from '../../chat/serializers/group-message.serializer';
import { AbuseTypeSerializer } from '../../abuse-type/serializers/abuse-type.serializer';

export class OrganizationReportSerializer {
  static serialize(
    data: OrganizationReport,
    fileUtilityService?: FileUtilityService,
  ) {
    return {
      id: data.id,
      type: data.reportType,
      event: data.event ? { id: data.event.id, title: data.event.title } : null,
      description: data.description ?? null,
      reporter: UserSerializer.serialize(fileUtilityService!, data.reporter),
      message:
        data.reportType == OrganizationReportTypeEnum.message
          ? GroupMessageSerializer.serialize(fileUtilityService!, data.message)
          : undefined,
      abuse_type:
        data.reportType == OrganizationReportTypeEnum.message
          ? AbuseTypeSerializer.serialize(data.abuseType)
          : undefined,
      date: moment(data.createdAt).format(DEFAULT_DB_DATETIME_FORMAT),
      status: data.status,
      resolved_at: data.resolvedAt
        ? moment(data.resolvedAt).format(DEFAULT_DB_DATETIME_FORMAT)
        : null,
      resolved_by: data.resolvedBy
        ? UserSerializer.serialize(fileUtilityService!, data.resolvedBy)
        : null,
    };
  }

  static serializeList(
    data: OrganizationReport[],
    fileUtilityService?: FileUtilityService,
  ) {
    return data.map((item) => this.serialize(item, fileUtilityService));
  }

  // static serializeWithMetadata(
  //   data: [reports: OrganizationReport[], count: number],
  //   fileUtilityService?: FileUtilityService,
  // ) {
  //
  // }
}
