import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ArrayParamPipe implements PipeTransform {
  transform(value?: string): string[] | undefined {
    if (!value) return undefined;

    // Regular expression to validate comma-separated values
    const regex = /^[a-zA-Z0-9]+(,[a-zA-Z0-9]+)*$/;

    if (!regex.test(value)) {
      throw new BadRequestException(
        'Invalid input format. Expected format: "value1,value2,value3,..."',
      );
    }

    return value.split(',');
  }
}
