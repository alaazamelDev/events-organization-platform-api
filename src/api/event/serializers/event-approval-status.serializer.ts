import { EventApprovalStatus } from '../entities/event-approval-status.entity';
import { ApprovalStatusSerializer } from '../../approval-status/serializers/approval-status.serializer';
import * as moment from 'moment';
import { DEFAULT_DB_DATETIME_FORMAT } from '../../../common/constants/constants';

export class EventApprovalStatusSerializer {
  static serialize(data: EventApprovalStatus) {
    return {
      set_by: data.setBy ? data.setBy.username : null,
      approval_status: ApprovalStatusSerializer.serialize(data.approvalStatus),
      from_date: data.fromDate
        ? moment(data.fromDate).format(DEFAULT_DB_DATETIME_FORMAT)
        : null,
      to_date: data.toDate
        ? moment(data.toDate).format(DEFAULT_DB_DATETIME_FORMAT)
        : null,
      note: data.note,
    };
  }

  static serializeList(data?: EventApprovalStatus[]) {
    if (!data) return null;
    return data.map((item) => this.serialize(item));
  }
}
