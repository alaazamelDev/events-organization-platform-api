import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { IUserRepository } from '../../../api/user/interfaces/user_repo.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../api/user/entities/user.entity';
import { UserRole } from '../../../api/userRole/entities/user_role.entity';

@ValidatorConstraint({ async: true })
export class IsEmailNotRegistered implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: IUserRepository,
  ) {}

  async validate(email: any) {
    const user = await this.userRepository.findByEmailAndRole(
      email,
      UserRole.ATTENDEE,
    );
    return user === undefined;
  }
}
