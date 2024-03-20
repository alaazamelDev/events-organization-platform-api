import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import * as moment from 'moment';

export function IsDateFormat(
  format: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isDateFormat',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [format],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (!value) return true; // Allow null or undefined values

          const [format] = args.constraints;
          return moment(value, format, true).isValid();
        },
        defaultMessage(args: ValidationArguments) {
          const [format] = args.constraints;
          return `${args.property} must be a valid date in format ${format}`;
        },
      },
    });
  };
}
