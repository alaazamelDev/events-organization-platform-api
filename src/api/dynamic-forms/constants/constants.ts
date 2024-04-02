import { ValidationRuleEnum } from '../enums/validation-rule.enum';
import { FIELD_TYPE } from '../enums/field-types.enum';

export const fieldTypesWithOptions = [FIELD_TYPE.RADIO_BUTTON];

export const rulesRequiresNumber = [
  ValidationRuleEnum.MAX,
  ValidationRuleEnum.MIN,
];

export const fieldTypesWithValidationRules = [
  FIELD_TYPE.NUMBER,
  FIELD_TYPE.TEXT,
];
