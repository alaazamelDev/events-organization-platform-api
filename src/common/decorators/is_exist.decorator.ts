import { ValidationOptions } from 'joi';
import { registerDecorator } from 'class-validator';
import { IsExistConstraint } from '../validators/is_exist_constraint';

export type IsExistInterface = {
  tableName: string;
  column: string;
};

export function IsExist(
  options: IsExistInterface,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsExist',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [options],
      validator: IsExistConstraint,
    });
  };
}
