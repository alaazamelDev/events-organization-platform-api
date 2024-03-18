import { IsEmailNotRegistered } from './is-email-not-registered.constraint';
import { registerDecorator, ValidationOptions } from 'class-validator';

export function EmailNotRegistered(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsEmailNotRegistered,
    });
  };
}
