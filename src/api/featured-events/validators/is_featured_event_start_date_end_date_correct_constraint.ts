import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { CreateFeaturedEventDto } from '../dto/create-featured-event.dto';

@ValidatorConstraint({
  name: 'IsFeaturedEventStartDateEndDateCorrectConstraint',
  async: true,
})
export class IsFeaturedEventStartDateEndDateCorrectConstraint
  implements ValidatorConstraintInterface
{
  async validate(_value: any, _args: ValidationArguments) {
    const object = _args.object as CreateFeaturedEventDto;

    const start_date = new Date(object.start_date).getTime();
    const end_date = new Date(object.end_date).getTime();

    return start_date < end_date;
  }

  defaultMessage(_args: ValidationArguments) {
    return `the start date must be before the end date`;
  }
}
