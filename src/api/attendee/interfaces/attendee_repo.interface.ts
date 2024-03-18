import { Attendee } from '../entities/attendee.entity';
import { Repository } from 'typeorm';

export interface IAttendeeRepository extends Repository<Attendee> {}
