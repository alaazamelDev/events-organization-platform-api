import { PartialType } from '@nestjs/mapped-types';
import { CreateEventDayRequest } from './create-event-day.request';

export class UpdateEventDayRequest extends PartialType(CreateEventDayRequest) {}
