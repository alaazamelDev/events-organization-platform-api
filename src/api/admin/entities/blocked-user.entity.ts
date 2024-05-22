import { BaseEntity } from '../../../common/entities/base.entity';
import { Entity, JoinColumn, ManyToOne, OneToOne, RelationId } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { UserRole } from '../../userRole/entities/user_role.entity';

@Entity('blocked_users')
export class BlockedUser extends BaseEntity {
  @OneToOne(() => User, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @RelationId((blockedUser: BlockedUser) => blockedUser.user, 'user_id')
  userId: number | undefined;

  @ManyToOne(() => UserRole, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_role_id' })
  userRole: UserRole;

  @RelationId(
    (blockedUser: BlockedUser) => blockedUser.userRole,
    'user_role_id',
  )
  userRoleId: number | undefined;
}
