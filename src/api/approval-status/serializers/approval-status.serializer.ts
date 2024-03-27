import { ApprovalStatus } from '../entities/approval-status.entity';

export class ApprovalStatusSerializer {
  static serialize(data: ApprovalStatus) {
    return {
      value: data.id,
      label: data.statusName,
    };
  }

  static serializeList(data?: ApprovalStatus[]) {
    if (!data) return [];
    return data.map((item) => this.serialize(item));
  }
}
