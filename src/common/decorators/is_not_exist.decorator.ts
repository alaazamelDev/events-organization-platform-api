import { ValidationOptions } from 'joi';
import { registerDecorator } from 'class-validator';
import { IsNotExistConstraint } from '../validators/is_not_exist_constraint';

export type IsNotExistInterface = {
  tableName: string;
  column: string;
};

export function IsNotExist(
  options: IsNotExistInterface,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsNotExist',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [options],
      validator: IsNotExistConstraint,
    });
  };
}
