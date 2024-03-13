import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../user/entities/user.entity';

@Entity('attendees')
export class Attendee extends BaseEntity {
  // Foreign Key
  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    name: 'first_name',
    type: 'varchar',
    nullable: false,
  })
  firstName!: string;

  @Column({
    name: 'last_name',
    type: 'varchar',
    nullable: false,
  })
  lastName!: string;

  @Column({
    name: 'phone_number',
    type: 'varchar',
    nullable: true,
  })
  phoneNumber?: string;

  @Column({
    name: 'profile_picture_url',
    type: 'text',
    nullable: true,
  })
  profilePictureUrl?: string;

  @Column({
    name: 'birth_date',
    type: 'date',
    nullable: true,
  })
  birthDate?: Date;

  @Column({
    name: 'bio',
    type: 'text',
    nullable: true,
  })
  bio?: string;

  @Column({
    name: 'cover_picture_url',
    type: 'text',
    nullable: true,
  })
  coverPictureUrl?: string;
}
