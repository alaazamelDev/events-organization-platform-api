import { omitBy, isNil } from 'lodash';

export class GetRulesSerializer {
  static serialize(history: any) {
    return omitBy(history, isNil);
  }

  static serializeList(data: any[]) {
    return data.map((item) => omitBy(item, isNil));
  }
}
